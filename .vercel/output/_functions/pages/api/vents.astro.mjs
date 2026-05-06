export { renderers } from '../../renderers.mjs';

const vents = /* @__PURE__ */ new Map();
const rateLimits = /* @__PURE__ */ new Map();
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}
function sanitize(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").trim();
}
function isRateLimited(ip) {
  const now = Date.now();
  const limit = rateLimits.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 864e5 });
    return false;
  }
  if (limit.count >= 5) return true;
  limit.count++;
  return false;
}
function cleanExpired() {
  const now = Date.now();
  for (const [id, vent] of vents) {
    if (now > vent.expiresAt) {
      vents.delete(id);
    }
  }
}
const GET = async () => {
  cleanExpired();
  const liveVents = Array.from(vents.values()).sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
  return new Response(JSON.stringify({ vents: liveVents }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Prea multe gânduri pentru azi. Revino mâine." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await request.json();
    const text = typeof body.text === "string" ? sanitize(body.text) : "";
    if (!text || text.length === 0) {
      return new Response(
        JSON.stringify({ error: "Gândul nu poate fi gol." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (text.length > 140) {
      return new Response(
        JSON.stringify({ error: "Maxim 140 de caractere. Fii concis." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const now = Date.now();
    const vent = {
      id: generateId(),
      text,
      createdAt: now,
      expiresAt: now + 864e5,
      // 24h
      reactions: { heart: 0, x: 0 }
    };
    vents.set(vent.id, vent);
    return new Response(JSON.stringify({ vent }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Ceva s-a stricat. Încearcă din nou." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

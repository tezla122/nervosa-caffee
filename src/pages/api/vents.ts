// /api/vents.ts — Vent Wall API (SSR endpoint)
// In dev: uses in-memory store
// In production: uses Vercel KV (Redis)

import type { APIRoute } from 'astro';

// ── Types ──
interface Vent {
  id: string;
  text: string;
  createdAt: number;
  expiresAt: number;
  reactions: {
    heart: number;
    x: number;
  };
}

// ── In-memory store (dev fallback) ──
const vents: Map<string, Vent> = new Map();
const rateLimits: Map<string, { count: number; resetAt: number }> = new Map();

// ── Helpers ──
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function sanitize(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 86400000 });
    return false;
  }

  if (limit.count >= 5) return true;

  limit.count++;
  return false;
}

function cleanExpired(): void {
  const now = Date.now();
  for (const [id, vent] of vents) {
    if (now > vent.expiresAt) {
      vents.delete(id);
    }
  }
}

// ── GET: Return last 20 live vents ──
export const GET: APIRoute = async () => {
  cleanExpired();

  const liveVents = Array.from(vents.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 20);

  return new Response(JSON.stringify({ vents: liveVents }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// ── POST: Create a new vent ──
export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Rate limit check
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Prea multe gânduri pentru azi. Revino mâine.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const text = typeof body.text === 'string' ? sanitize(body.text) : '';

    if (!text || text.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Gândul nu poate fi gol.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (text.length > 140) {
      return new Response(
        JSON.stringify({ error: 'Maxim 140 de caractere. Fii concis.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = Date.now();
    const vent: Vent = {
      id: generateId(),
      text,
      createdAt: now,
      expiresAt: now + 86400000, // 24h
      reactions: { heart: 0, x: 0 },
    };

    vents.set(vent.id, vent);

    return new Response(JSON.stringify({ vent }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Ceva s-a stricat. Încearcă din nou.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Make this route server-rendered
export const prerender = false;

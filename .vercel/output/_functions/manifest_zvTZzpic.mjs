import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_DNFY0soc.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_Bet6tVIF.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///D:/sites/nervosa-caffee/","cacheDir":"file:///D:/sites/nervosa-caffee/node_modules/.astro/","outDir":"file:///D:/sites/nervosa-caffee/dist/","srcDir":"file:///D:/sites/nervosa-caffee/src/","publicDir":"file:///D:/sites/nervosa-caffee/public/","buildClientDir":"file:///D:/sites/nervosa-caffee/dist/client/","buildServerDir":"file:///D:/sites/nervosa-caffee/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"manifesto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/manifesto","isIndex":false,"type":"page","pattern":"^\\/manifesto\\/?$","segments":[[{"content":"manifesto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/manifesto.astro","pathname":"/manifesto","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"menu/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/menu","isIndex":false,"type":"page","pattern":"^\\/menu\\/?$","segments":[[{"content":"menu","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/menu.astro","pathname":"/menu","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"sob/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/sob","isIndex":false,"type":"page","pattern":"^\\/sob\\/?$","segments":[[{"content":"sob","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sob.astro","pathname":"/sob","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/vents","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/vents\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"vents","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/vents.ts","pathname":"/api/vents","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://nervosa.cafe","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/sites/nervosa-caffee/src/pages/sob.astro",{"propagation":"none","containsHead":true}],["D:/sites/nervosa-caffee/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/sites/nervosa-caffee/src/pages/manifesto.astro",{"propagation":"none","containsHead":true}],["D:/sites/nervosa-caffee/src/pages/menu.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/vents@_@ts":"pages/api/vents.astro.mjs","\u0000@astro-page:src/pages/manifesto@_@astro":"pages/manifesto.astro.mjs","\u0000@astro-page:src/pages/menu@_@astro":"pages/menu.astro.mjs","\u0000@astro-page:src/pages/sob@_@astro":"pages/sob.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_zvTZzpic.mjs","D:/sites/nervosa-caffee/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BOUnCspP.mjs","D:/sites/nervosa-caffee/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.Da4vMdZ6.js","D:/sites/nervosa-caffee/src/components/Footer.astro?astro&type=script&index=0&lang.ts":"_astro/Footer.astro_astro_type_script_index_0_lang.DrZGE4yK.js","D:/sites/nervosa-caffee/src/components/SidebarNav.astro?astro&type=script&index=0&lang.ts":"_astro/SidebarNav.astro_astro_type_script_index_0_lang.RDPd1Yxi.js","D:/sites/nervosa-caffee/src/components/MobileNav.astro?astro&type=script&index=0&lang.ts":"_astro/MobileNav.astro_astro_type_script_index_0_lang.BnN2nSak.js","D:/sites/nervosa-caffee/src/components/HeroSection.astro?astro&type=script&index=0&lang.ts":"_astro/HeroSection.astro_astro_type_script_index_0_lang.B41BMV4l.js","D:/sites/nervosa-caffee/src/components/VentWallSection.astro?astro&type=script&index=0&lang.ts":"_astro/VentWallSection.astro_astro_type_script_index_0_lang.Ccm7lMoT.js","D:/sites/nervosa-caffee/src/components/LocationSection.astro?astro&type=script&index=0&lang.ts":"_astro/LocationSection.astro_astro_type_script_index_0_lang.B_5rkot9.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/sites/nervosa-caffee/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts","const o=document.querySelectorAll(\".tear-in\"),t=document.querySelectorAll(\".scribble\"),c={threshold:.15,rootMargin:\"0px 0px -50px 0px\"},s=new IntersectionObserver(e=>{e.forEach(r=>{r.isIntersecting&&r.target.classList.add(\"visible\")})},c);o.forEach(e=>s.observe(e));t.forEach(e=>s.observe(e));"],["D:/sites/nervosa-caffee/src/components/Footer.astro?astro&type=script&index=0&lang.ts","const i=document.getElementById(\"footer-logo\"),t=document.getElementById(\"easter-egg-toast\");let e=0,s;const o=[\"\",\"\",\"\",\"\",\"hmm...\",\"aproape...\",\"mai dă un click...\"];i.addEventListener(\"click\",()=>{if(e++,clearTimeout(s),e>=7){t.textContent=\"🎧 ai descoperit playlist-ul secret!\",t.classList.add(\"show\"),setTimeout(()=>{window.open(\"https://open.spotify.com/playlist/PLACEHOLDER\",\"_blank\"),t.classList.remove(\"show\")},1500),e=0;return}o[e-1]&&(t.textContent=o[e-1],t.classList.add(\"show\"),setTimeout(()=>t.classList.remove(\"show\"),1e3)),s=setTimeout(()=>{e=0},3e3)});"],["D:/sites/nervosa-caffee/src/components/SidebarNav.astro?astro&type=script&index=0&lang.ts","const r=document.querySelectorAll(\".sidebar-dot\"),n=document.getElementById(\"sidebar-arrow\"),a=[\"hero\",\"manifesto\",\"menu\",\"vent-wall\",\"location\"],l=new IntersectionObserver(o=>{o.forEach(e=>{if(e.isIntersecting){const s=e.target.id;r.forEach(t=>{if(t.classList.toggle(\"active\",t.dataset.section===s),t.dataset.section===s&&n){const c=t.getBoundingClientRect(),i=t.closest(\".sidebar-nav\").getBoundingClientRect();n.style.top=`${c.top-i.top+2}px`}})}})},{threshold:.3});a.forEach(o=>{const e=document.getElementById(o);e&&l.observe(e)});"],["D:/sites/nervosa-caffee/src/components/MobileNav.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"mobile-hamburger\"),n=document.getElementById(\"mobile-overlay\"),s=n.querySelectorAll(\".overlay-link\");function o(){const e=t.classList.toggle(\"open\");n.classList.toggle(\"open\",e),n.setAttribute(\"aria-hidden\",String(!e)),t.setAttribute(\"aria-expanded\",String(e)),document.body.style.overflow=e?\"hidden\":\"\"}t.addEventListener(\"click\",o);s.forEach(e=>{e.addEventListener(\"click\",()=>{t.classList.remove(\"open\"),n.classList.remove(\"open\"),n.setAttribute(\"aria-hidden\",\"true\"),t.setAttribute(\"aria-expanded\",\"false\"),document.body.style.overflow=\"\"})});document.addEventListener(\"keydown\",e=>{e.key===\"Escape\"&&t.classList.contains(\"open\")&&o()});"],["D:/sites/nervosa-caffee/src/components/HeroSection.astro?astro&type=script&index=0&lang.ts","const o=[\"Cafea bună, oameni interesanți, gânduri necenzurate.\",\"Aici, toată lumea e puțin nevrotică (și e ok).\",\"Făcută cu grijă. Servită cu sclipici.\"],s=document.getElementById(\"hero-tagline\");if(s){let e=function(){const r=o[n];if(i){if(s.textContent=r.substring(0,t-1),t--,t===0){i=!1,n=(n+1)%o.length,setTimeout(e,400);return}setTimeout(e,30)}else{if(s.textContent=r.substring(0,t+1),t++,t===r.length){if(u++,u<30){setTimeout(e,80);return}u=0,i=!0,setTimeout(e,50);return}setTimeout(e,55+Math.random()*45)}},n=0,t=0,i=!1,u=0;setTimeout(e,800)}"],["D:/sites/nervosa-caffee/src/components/VentWallSection.astro?astro&type=script&index=0&lang.ts","const l=document.getElementById(\"vent-textarea\"),m=document.getElementById(\"vent-char-count\"),c=document.getElementById(\"vent-submit\"),s=document.getElementById(\"vent-loader\"),d=document.getElementById(\"corkboard\"),y=document.getElementById(\"corkboard-empty\"),u=[\"Procesăm anxietatea ta...\",\"Salvăm gândul în cosmos...\",\"Aproape. Sau poate nu. De fapt da.\",\"Gândul tău e important. Probabil.\",\"Scriu pe perete... metaforic.\"];l.addEventListener(\"input\",()=>{const t=l.value.length;m.textContent=`${t} / 140`,m.style.color=t>120?\"var(--ink-rust)\":\"var(--ash)\"});let o=[];function h(){return Math.random().toString(36).substring(2,10)}function v(t){const e=t-Date.now();if(e<=0)return\"expirat\";const n=Math.floor(e/36e5),a=Math.floor(e%36e5/6e4);return`dispare în ${n}h ${a}m`}function g(t){const e=(Math.random()-.5)*10,n=document.createElement(\"div\");return n.className=\"vent-note\",n.style.transform=`rotate(${e}deg)`,n.innerHTML=`\n      <p style=\"margin:0 0 0.5rem\">${t.text}</p>\n      <div style=\"display:flex;justify-content:space-between;align-items:center\">\n        <span class=\"font-mono\" style=\"font-size:0.65rem;color:var(--ash)\">${v(t.expiresAt)}</span>\n        <div style=\"display:flex;gap:0.8rem\">\n          <button class=\"vent-react\" data-id=\"${t.id}\" data-type=\"heart\" aria-label=\"Iubește\" style=\"background:none;border:none;cursor:pointer;font-size:1rem;color:var(--ink-rust)\">\n            ❤ <span class=\"font-mono\" style=\"font-size:0.7rem\">${t.reactions.heart}</span>\n          </button>\n          <button class=\"vent-react\" data-id=\"${t.id}\" data-type=\"x\" aria-label=\"Nu\" style=\"background:none;border:none;cursor:pointer;font-size:1rem;color:var(--ash)\">\n            ✗ <span class=\"font-mono\" style=\"font-size:0.7rem\">${t.reactions.x}</span>\n          </button>\n        </div>\n      </div>\n    `,n}function p(){if(d.querySelectorAll(\".vent-note\").forEach(t=>t.remove()),o.length===0){y.style.display=\"\";return}y.style.display=\"none\",o.forEach(t=>{d.appendChild(g(t))}),d.querySelectorAll(\".vent-react\").forEach(t=>{t.addEventListener(\"click\",e=>{const n=e.currentTarget,a=n.dataset.id,i=n.dataset.type,r=o.find(f=>f.id===a);r&&(r.reactions[i]++,p())})})}c.addEventListener(\"click\",async()=>{const t=l.value.trim();if(!t||t.length>140)return;c.style.display=\"none\",s.style.display=\"\";let e=0;s.textContent=u[0];const n=setInterval(()=>{e=(e+1)%u.length,s.textContent=u[e]},1200);await new Promise(r=>setTimeout(r,2e3+Math.random()*1e3)),clearInterval(n),s.style.display=\"none\",c.style.display=\"\";const a=Date.now(),i={id:h(),text:t,createdAt:a,expiresAt:a+864e5,reactions:{heart:0,x:0}};o.unshift(i),o.length>20&&(o=o.slice(0,20)),l.value=\"\",m.textContent=\"0 / 140\",p()});p();"]],"assets":["/_astro/index.C4XHgxoF.css","/_astro/index.BHD0837f.css","/favicon.ico","/favicon.svg","/fonts/ShareTechMono-Regular.woff2","/_astro/LocationSection.astro_astro_type_script_index_0_lang.B_5rkot9.js","/_astro/maplibre-gl.B6IE4cB_.js","/manifesto/index.html","/menu/index.html","/sob/index.html","/index.html"],"i18n":{"fallbackType":"redirect","strategy":"pathname-prefix-other-locales","locales":["ro","en"],"defaultLocale":"ro","domainLookupTable":{}},"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"/YjXIgkGQy9vzJeGwne6fa0fXBAdMejoxuSrsr4/zWw="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };

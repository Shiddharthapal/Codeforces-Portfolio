import { n as NOOP_MIDDLEWARE_HEADER, p as decodeKey } from './chunks/astro/server_DG7NA_CD.mjs';
import 'clsx';
import './chunks/shared_pnX4ag4q.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

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

const manifest = deserializeManifest({"hrefRoot":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/","cacheDir":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/node_modules/.astro/","outDir":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/dist/","srcDir":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/src/","publicDir":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/public/","buildClientDir":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/dist/","buildServerDir":"file:///D:/All%20Projects%20,Code/Projects/Codeforces-Portfolio/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.16.9_@netlify+blobs_757a59f74bd419c03ba3559c080b75bd/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/forgot-password","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/forgot-password\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"forgot-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/forgot-password.ts","pathname":"/api/auth/forgot-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/google","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/google\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"google","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/google.ts","pathname":"/api/auth/google","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/reset-password","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/reset-password\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"reset-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/reset-password.ts","pathname":"/api/auth/reset-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/send-otp","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/send-otp\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"send-otp","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/send-otp.ts","pathname":"/api/auth/send-otp","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/verify-otp","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/verify-otp\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"verify-otp","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/verify-otp.ts","pathname":"/api/auth/verify-otp","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contestants","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contestants\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contestants","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contestants.ts","pathname":"/api/contestants","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/login.ts","pathname":"/api/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/register.ts","pathname":"/api/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/alluser","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/allUser\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"allUser","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/allUser.ts","pathname":"/api/userApi/allUser","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/codeforces","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/codeforces\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"codeforces","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/codeforces.ts","pathname":"/api/userApi/codeforces","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/profilecreate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/profileCreate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"profileCreate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/profileCreate.ts","pathname":"/api/userApi/profileCreate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/upcomingcontest","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/upComingContest\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"upComingContest","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/upComingContest.ts","pathname":"/api/userApi/upComingContest","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/userApi/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.16.9_@netlify+blobs_757a59f74bd419c03ba3559c080b75bd/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/auth/forgot-password@_@ts":"pages/api/auth/forgot-password.astro.mjs","\u0000@astro-page:src/pages/api/auth/google@_@ts":"pages/api/auth/google.astro.mjs","\u0000@astro-page:src/pages/api/auth/reset-password@_@ts":"pages/api/auth/reset-password.astro.mjs","\u0000@astro-page:src/pages/api/auth/send-otp@_@ts":"pages/api/auth/send-otp.astro.mjs","\u0000@astro-page:src/pages/api/auth/verify-otp@_@ts":"pages/api/auth/verify-otp.astro.mjs","\u0000@astro-page:src/pages/api/contestants@_@ts":"pages/api/contestants.astro.mjs","\u0000@astro-page:src/pages/api/login@_@ts":"pages/api/login.astro.mjs","\u0000@astro-page:src/pages/api/register@_@ts":"pages/api/register.astro.mjs","\u0000@astro-page:src/pages/api/userApi/allUser@_@ts":"pages/api/userapi/alluser.astro.mjs","\u0000@astro-page:src/pages/api/userApi/codeforces@_@ts":"pages/api/userapi/codeforces.astro.mjs","\u0000@astro-page:src/pages/api/userApi/profileCreate@_@ts":"pages/api/userapi/profilecreate.astro.mjs","\u0000@astro-page:src/pages/api/userApi/upComingContest@_@ts":"pages/api/userapi/upcomingcontest.astro.mjs","\u0000@astro-page:src/pages/api/userApi/[id]@_@ts":"pages/api/userapi/_id_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_ffz74h4r.mjs","D:/All Projects ,Code/Projects/Codeforces-Portfolio/node_modules/.pnpm/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/chunks/multipart-parser.mjs":"chunks/multipart-parser_DCgEn13u.mjs","@/layouts/Layout":"_astro/Layout.gYpT4Gzk.js","@astrojs/react/client.js":"_astro/client.D2_DOcPV.js","D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/components/pages/home/index.tsx":"_astro/index.D-ydgCdO.js","D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/components/pages/login/index.tsx":"_astro/index.B9WYr9Ub.js","D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/components/pages/register/index.tsx":"_astro/index.U5aI--7t.js","D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/components/pages/forgot-password/index.tsx":"_astro/index.DQZBbwge.js","D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/components/pages/profile/index.tsx":"_astro/index.DPaliiCs.js","D:/All Projects ,Code/Projects/Codeforces-Portfolio/src/components/App":"_astro/App.DcZYVX11.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.Zb6Sgox5.css","/favicon.svg","/placeholder.svg","/prize.svg","/trophy_78370-345.avif","/_redirects","/_astro/App.BOsicwFG.js","/_astro/App.DcZYVX11.js","/_astro/badge.HuwSvovL.js","/_astro/client.D2_DOcPV.js","/_astro/eye.D7SnsPak.js","/_astro/index.5u7LAm7r.js","/_astro/index.B9WYr9Ub.js","/_astro/index.D-ydgCdO.js","/_astro/index.Dh6hVTT6.js","/_astro/index.DPaliiCs.js","/_astro/index.DQZBbwge.js","/_astro/index.DYwCuWnG.js","/_astro/index.esm.CK1xFfVb.js","/_astro/index.U5aI--7t.js","/_astro/jsx-runtime.BBGWwODT.js","/_astro/label.21Vr_5s2.js","/_astro/Layout.gYpT4Gzk.js","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"atrSK04GNl423os49NBQVdaagrIVR7cyAqKj6hzbBcs=","sessionConfig":{"driver":"netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/netlify-blobs_CQm7jH1H.mjs').then(n => n.n);

export { manifest };

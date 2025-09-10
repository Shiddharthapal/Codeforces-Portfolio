import { d as decodeKey } from './chunks/astro/server_BU2TA60D.mjs';
import './chunks/astro-designed-error-pages_DQNOyKaJ.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_q34-0uL0.mjs';

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
    isIndex: rawRouteData.isIndex
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

const manifest = deserializeManifest({"hrefRoot":"file:///C:/All%20Projects%20,Code/Projects/Codeforces%20Portal/","adapterName":"@astrojs/vercel","routes":[{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.16.19_@types+node@20.17.25_lightningcss@1.29.2_rollup@4.36.0_typescript@5.8.2/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contestants","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contestants\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contestants","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contestants.ts","pathname":"/api/contestants","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/login.ts","pathname":"/api/login","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/register","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/register\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/register.ts","pathname":"/api/register","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/alluser","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/allUser\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"allUser","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/allUser.ts","pathname":"/api/userApi/allUser","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/codeforces","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/codeforces\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"codeforces","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/codeforces.ts","pathname":"/api/userApi/codeforces","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/profilecreate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/profileCreate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"profileCreate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/profileCreate.ts","pathname":"/api/userApi/profileCreate","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/upcomingcontest","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/upComingContest\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"upComingContest","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/userApi/upComingContest.ts","pathname":"/api/userApi/upComingContest","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/userapi/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/userApi\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"userApi","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/userApi/[id].ts","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/All Projects ,Code/Projects/Codeforces Portal/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:src/pages/api/login@_@ts":"pages/api/login.astro.mjs","\u0000@astro-page:src/pages/api/register@_@ts":"pages/api/register.astro.mjs","\u0000@astro-page:src/pages/api/userApi/allUser@_@ts":"pages/api/userapi/alluser.astro.mjs","\u0000@astro-page:src/pages/api/userApi/codeforces@_@ts":"pages/api/userapi/codeforces.astro.mjs","\u0000@astro-page:src/pages/api/userApi/profileCreate@_@ts":"pages/api/userapi/profilecreate.astro.mjs","\u0000@astro-page:src/pages/api/userApi/upComingContest@_@ts":"pages/api/userapi/upcomingcontest.astro.mjs","\u0000@astro-page:src/pages/api/userApi/[id]@_@ts":"pages/api/userapi/_id_.astro.mjs","\u0000@astro-page:src/pages/api/contestants@_@ts":"pages/api/contestants.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.16.19_@types+node@20.17.25_lightningcss@1.29.2_rollup@4.36.0_typescript@5.8.2/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-manifest":"manifest_C2PRBWJl.mjs","@/layouts/Layout":"_astro/Layout.Cz6g0bvx.js","@astrojs/react/client.js":"_astro/client.fm8_GP-O.js","C:/All Projects ,Code/Projects/Codeforces Portal/src/components/pages/home/index.tsx":"_astro/index.CX_xe-C3.js","C:/All Projects ,Code/Projects/Codeforces Portal/src/components/pages/login/index.tsx":"_astro/index.A28bFxW4.js","C:/All Projects ,Code/Projects/Codeforces Portal/src/components/pages/register/index.tsx":"_astro/index.y0-H00U2.js","C:/All Projects ,Code/Projects/Codeforces Portal/src/components/pages/profile/index.tsx":"_astro/index.t1reVpdA.js","C:/All Projects ,Code/Projects/Codeforces Portal/src/components/App":"_astro/App.BzINTwVP.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.DxjHIBsG.css","/favicon.svg","/placeholder.svg","/_astro/App.BzINTwVP.js","/_astro/App.C1GNAE-m.js","/_astro/badge.flHerO0w.js","/_astro/client.fm8_GP-O.js","/_astro/index.A28bFxW4.js","/_astro/index.B5-LoY6T.js","/_astro/index.BiFHKRHA.js","/_astro/index.CGWoMmjv.js","/_astro/index.CX_xe-C3.js","/_astro/index.esm.J5mX-XEf.js","/_astro/index.t1reVpdA.js","/_astro/index.y0-H00U2.js","/_astro/jsx-runtime.BPgyfgyD.js","/_astro/label.DbtM6Mt5.js","/_astro/Layout.Cz6g0bvx.js","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"1x1TP/8CqKfC4Lu9w1cStZqf5eQfgVZTb7jVY9mYhTI=","experimentalEnvGetSecretEnabled":false});

export { manifest };

import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_CEM-Lzaj.mjs';
import { manifest } from './manifest_6Q7N404-.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/contestants.astro.mjs');
const _page2 = () => import('./pages/api/login.astro.mjs');
const _page3 = () => import('./pages/api/register.astro.mjs');
const _page4 = () => import('./pages/api/userapi/alluser.astro.mjs');
const _page5 = () => import('./pages/api/userapi/codeforces.astro.mjs');
const _page6 = () => import('./pages/api/userapi/profilecreate.astro.mjs');
const _page7 = () => import('./pages/api/userapi/upcomingcontest.astro.mjs');
const _page8 = () => import('./pages/api/userapi/_id_.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/.pnpm/astro@4.16.19_@types+node@20.17.25_lightningcss@1.29.2_rollup@4.36.0_typescript@5.8.2/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/contestants.ts", _page1],
    ["src/pages/api/login.ts", _page2],
    ["src/pages/api/register.ts", _page3],
    ["src/pages/api/userApi/allUser.ts", _page4],
    ["src/pages/api/userApi/codeforces.ts", _page5],
    ["src/pages/api/userApi/profileCreate.ts", _page6],
    ["src/pages/api/userApi/upComingContest.ts", _page7],
    ["src/pages/api/userApi/[id].ts", _page8],
    ["src/pages/index.astro", _page9]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };

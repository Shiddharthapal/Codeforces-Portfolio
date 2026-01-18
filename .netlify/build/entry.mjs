import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_ffz74h4r.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/forgot-password.astro.mjs');
const _page2 = () => import('./pages/api/auth/google.astro.mjs');
const _page3 = () => import('./pages/api/auth/reset-password.astro.mjs');
const _page4 = () => import('./pages/api/auth/send-otp.astro.mjs');
const _page5 = () => import('./pages/api/auth/verify-otp.astro.mjs');
const _page6 = () => import('./pages/api/contestants.astro.mjs');
const _page7 = () => import('./pages/api/login.astro.mjs');
const _page8 = () => import('./pages/api/register.astro.mjs');
const _page9 = () => import('./pages/api/userapi/alluser.astro.mjs');
const _page10 = () => import('./pages/api/userapi/codeforces.astro.mjs');
const _page11 = () => import('./pages/api/userapi/profilecreate.astro.mjs');
const _page12 = () => import('./pages/api/userapi/upcomingcontest.astro.mjs');
const _page13 = () => import('./pages/api/userapi/_id_.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.16.9_@netlify+blobs_757a59f74bd419c03ba3559c080b75bd/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/forgot-password.ts", _page1],
    ["src/pages/api/auth/google.ts", _page2],
    ["src/pages/api/auth/reset-password.ts", _page3],
    ["src/pages/api/auth/send-otp.ts", _page4],
    ["src/pages/api/auth/verify-otp.ts", _page5],
    ["src/pages/api/contestants.ts", _page6],
    ["src/pages/api/login.ts", _page7],
    ["src/pages/api/register.ts", _page8],
    ["src/pages/api/userApi/allUser.ts", _page9],
    ["src/pages/api/userApi/codeforces.ts", _page10],
    ["src/pages/api/userApi/profileCreate.ts", _page11],
    ["src/pages/api/userApi/upComingContest.ts", _page12],
    ["src/pages/api/userApi/[id].ts", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "36477d46-0a97-4d56-9c25-7d1e9ec29990"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };

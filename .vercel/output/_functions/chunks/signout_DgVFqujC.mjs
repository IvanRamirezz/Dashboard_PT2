import { c as clearSessionCookies } from './sessionCookies_DIQzV6Mc.mjs';

const POST = async ({ cookies, redirect }) => {
  clearSessionCookies(cookies);
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

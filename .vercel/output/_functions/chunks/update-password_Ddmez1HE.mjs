import { c as createSupabaseServerClient } from './supabase_BobEUS0I.mjs';
import { c as clearSessionCookies } from './sessionCookies_DIQzV6Mc.mjs';

const POST = async ({
  request,
  redirect,
  cookies
}) => {
  const supabase = createSupabaseServerClient();
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  if (!password) {
    return redirect("/auth/update-password?error=1");
  }
  const { error } = await supabase.auth.updateUser({
    password
  });
  if (error) {
    return redirect("/auth/update-password?error=1");
  }
  await supabase.auth.signOut();
  clearSessionCookies(cookies);
  return redirect("/auth/update-password?success=1");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

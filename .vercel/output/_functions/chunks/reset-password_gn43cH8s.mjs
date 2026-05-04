import { c as createSupabaseServerClient } from './supabase_BobEUS0I.mjs';

const POST = async ({
  request,
  redirect
}) => {
  const supabase = createSupabaseServerClient();
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  if (!email) {
    return redirect("/auth/forgot-password");
  }
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: new URL("/auth/update-password", request.url).toString()
    }
  );
  if (error) {
    return redirect("/auth/forgot-password");
  }
  return redirect("/auth/forgot-password?message=sent");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

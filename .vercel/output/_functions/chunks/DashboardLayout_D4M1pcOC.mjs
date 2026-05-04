import { c as createComponent } from './astro-component_CTgHl5fL.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, q as renderHead, l as renderComponent, p as renderSlot } from './entrypoint_ChOhswpG.mjs';
import 'clsx';

const $$Sidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Sidebar;
  const { role } = Astro2.props;
  const menuByRole = {
    admin: [
      { label: "Dashboard", url: "/dashboard/admin" },
      // { label: "Alta / Baja", url: "/dashboard/admin/altas" },
      { label: "Profesores", url: "/dashboard/admin/profesores" },
      { label: "Alumnos", url: "/dashboard/admin/alumnos" }
    ],
    profesor: [
      { label: "Inicio", url: "/dashboard/profesor" },
      { label: "Asignar", url: "/dashboard/profesor/asignar" },
      { label: "Calificar", url: "/dashboard/profesor/calificar" },
      { label: "Alumnos", url: "/dashboard/profesor/alumnos" },
      { label: "Gestión grupos", url: "/dashboard/profesor/gestionar-grupos" }
    ]
  };
  const menu = menuByRole[role] ?? [];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<aside class="sidebar"> <div class="sidebar-logo"> <img src="/images/LogoFiberLabvr.png" alt="FiberLab VR"> </div> <nav class="sidebar-menu"> ${menu.map((item) => {
    const isActive = currentPath === item.url;
    return renderTemplate`<a${addAttribute(item.url, "href")}${addAttribute(`menu-item ${isActive ? "active" : ""}`, "class")}> ${item.label} </a>`;
  })} </nav> <div class="sidebar-footer"> <form action="/api/auth/signout" method="post"> <button class="logout-sidebar">
Cerrar sesión
</button> </form> </div> </aside>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/dashboard/Sidebar.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const { email } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="header"> <div class="header-left"> <img src="/images/ipn.png" alt="IPN" class="logo-ipn"> </div> <div class="header-center"> <h2 class="header-title">
FiberLab VR
</h2> </div> <div class="header-right"> <img src="/images/upiita.png" alt="UPIITA" class="logo-upiita"> </div> </header>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/components/dashboard/Header.astro", void 0);

const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { title, role, userEmail } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="stylesheet" href="/styles/dashboard.css">${renderHead()}</head> <body> <div class="dashboard"> ${renderComponent($$result, "Sidebar", $$Sidebar, { "role": role })} <div class="main"> ${renderComponent($$result, "Header", $$Header, { "email": userEmail })} <main class="content"> ${renderSlot($$result, $$slots["default"])} </main> </div> </div> </body></html>`;
}, "/Users/ivanramirez/Dashboard-Web-/src/layouts/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };

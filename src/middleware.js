
const lockRoutes = ["/", "/profile", "/admin"];
const unLockRouter = ["/login", "/register"];

export function onRequest(context, next) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  const userCookie = context.cookies.get("user");

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (error) {
      context.cookies.delete("user");
      user = null;
    }
  }

  // 🔒 Si intenta acceder a ruta privada sin login
  if (lockRoutes.includes(pathname) && !user) {
    return Response.redirect(new URL("/login", url.origin));
  }

  // 🔓 Evitar login/register si ya está logueado
  if (unLockRouter.includes(pathname) && user) {
    return Response.redirect(new URL("/", url.origin));
  }

  // 🚨 Si es admin y entra a /admin
  if (pathname.startsWith("/admin")) {
    if (
      !user ||
      (user.perfil !== "Administrador" && user.perfil !== "Superadministrador")
    ) {
      return Response.redirect(new URL("/", url.origin));
    }
  }

  // 🚨 Si es usuario normal y entra a /admin, redirigir
  if (pathname.startsWith("/admin") && user?.perfil === "Usuario") {
    return Response.redirect(new URL("/", url.origin));
  }

  return next();
}

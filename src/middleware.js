// Rutas que requieren autenticación general
const lockRoutes = ["/", "/admin", "/user"];

// Rutas públicas (no necesitan login)
const unLockRouter = ["/login", "/register", "/logout"];

// Rutas permitidas por rol
const routesByRole = {
  Usuario: ["/gestion-personas"],
  Empleado: ["/gestion-personas"],
  Administrador: [
    "/gestion-personas",
    "/gestion-perfil",
    "/gestion-usuarios",
    "/gestion-rutas",
    "/gestion-sitios",
    "/gestion-actividades",
  ],
  Superadministrador: [
    "/gestion-personas",
    "/gestion-perfil",
    "/gestion-usuarios",
    "/gestion-rutas",
    "/gestion-sitios",
    "/gestion-actividades",
  ],
};

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

  //  Permitir libre acceso a rutas públicas
  if (unLockRouter.includes(pathname)) {
    return next();
  }

  //  Si intenta acceder a ruta privada sin login
  if (lockRoutes.includes(pathname) && !user) {
    return Response.redirect(new URL("/login", url.origin));
  }

  // Evitar login/register si ya está logueado
  if (["/login", "/register"].includes(pathname) && user) {
    return Response.redirect(new URL("/", url.origin));
  }

  //  Protección por roles
  if (user && routesByRole[user.perfil]) {
    const allowedRoutes = routesByRole[user.perfil];
    const isAllowed = allowedRoutes.some((r) => pathname.startsWith(r));

    if (!isAllowed) {
      // Redirigir si intenta acceder a una ruta no permitida
      return Response.redirect(new URL("/gestion-personas", url.origin));
    }
  }

  //  Si no tiene perfil definido, enviarlo al login
  if (!user?.perfil) {
    return Response.redirect(new URL("/login", url.origin));
  }

  return next();
}

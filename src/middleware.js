const lockRoutes = ["/profile", "/"];
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

  if (lockRoutes.includes(pathname)) {
    if (!user) {
      return Response.redirect(new URL("/login", url.origin));
    }
  }

  if (unLockRouter.includes(pathname) && user) {
    return Response.redirect(new URL("/", url.origin));
  }

  return next();
}

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Allow login page, auth API, and static assets through without auth check
  if (
    pathname === '/login' ||
    pathname === '/api/auth' ||
    pathname.startsWith('/_astro/') ||
    pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|pdf|mp4|webm)$/)
  ) {
    return next();
  }

  // Check for the auth cookie
  const authCookie = context.cookies.get('site-auth');

  if (authCookie?.value === 'authenticated') {
    return next();
  }

  // Not authenticated — redirect to login, preserving the requested URL
  const redirectTo = encodeURIComponent(pathname + context.url.search);
  return context.redirect(`/login?redirect=${redirectTo}`, 302);
});

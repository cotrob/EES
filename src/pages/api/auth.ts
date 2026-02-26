import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { password, redirect } = body;

    const sitePassword = import.meta.env.SITE_PASSWORD;

    if (!sitePassword) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password === sitePassword) {
      cookies.set('site-auth', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Only allow relative redirects to prevent open redirect attacks
      const safeRedirect = redirect && redirect.startsWith('/') ? redirect : '/';

      return new Response(
        JSON.stringify({ success: true, redirect: safeRedirect }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid password' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Bad request' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const protectedRoutes = ["/home"];
const authRoutes = ["/login", "/register"];
const publicApiRoutes = ["/api/auth/"]; // Ruta de NextAuth que debe ser pública

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // 1. Permitir acceso público a rutas específicas de la API (como NextAuth)
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
    if (isPublicApiRoute) {
        return NextResponse.next();
    }

    // 2. Proteger el resto de rutas API
    if (pathname.startsWith('/api')) {
        if (!token) {
            return new NextResponse(
                JSON.stringify({ error: 'No autorizado' }),
                { 
                    status: 401, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }

        // Inyectar user ID en headers para APIs protegidas
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', token.id as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    }

    // 3. Redirigir usuarios autenticados desde rutas de login/register
    const isAuthRoute = authRoutes.includes(pathname);
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // 4. Proteger rutas como /home
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/start', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home/:path*", "/api/:path*", "/login", "/register"]
};
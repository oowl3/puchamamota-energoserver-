import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const protectedRoutes = ["/home"];
const authRoutes = ["/login", "/register"];

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.includes(pathname);

    // 1. Redirigir usuarios autenticados lejos de rutas de autenticación
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // 2. Proteger rutas restringidas
    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL('/start', req.url));
        }
        
        // 3. Inyectar ID de usuario en headers de la solicitud
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', token.id as string);
        
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home/:path*", "/login", "/register"]
};
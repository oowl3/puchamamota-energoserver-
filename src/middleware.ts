import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const protectedRoutes = ["/home"];
const authRoutes = ["/login", "/register"];
const publicApiRoutes = [
  "/api/auth/",         // Rutas de NextAuth
  "/api/prueba_w",      // Nueva ruta pública
  "/api/consumo"        // Nueva ruta pública
];

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // 1. Permitir acceso público a rutas API específicas
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
    //const isPublicApiRoute = publicApiRoutes.includes(pathname);


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

    // 3. Redirigir usuarios autenticados desde rutas de auth
    const isAuthRoute = authRoutes.includes(pathname);
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/home', req.url));
    }

    // 4. Proteger rutas privadas
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/start', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home/:path*", "/api/:path*", "/login", "/register"]
};
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

const protectedRoutes = ["/home"];
const authRoutes = ["/login", "/register"];
// Agregar las nuevas rutas API al array de públicas
const publicApiRoutes = ["/api/auth/", "/api/prueba_w", "/api/consumo"];

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = req.nextUrl;

    // 1. Permitir acceso público a rutas API específicas
    const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route));
    if (isPublicApiRoute) {
        return NextResponse.next();
    }

    // Resto del código sin cambios...
    // ... (las otras secciones del middleware se mantienen igual)
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/home/:path*", "/api/:path*", "/login", "/register"]
};
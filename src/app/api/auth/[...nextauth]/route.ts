import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { session } from '@/lib/session'; // Asegúrate de que la ruta sea correcta

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                throw new Error('Perfil sin email');
            }
    
            try {
                const [nombre, apellido = ""] = profile.name?.split(" ") || ["", ""];
                
                await prisma.usuario.upsert({
                    where: { email: profile.email },
                    create: {
                        email: profile.email,
                        nombre,
                        apellido,
                        edad: 0, 
                        genero: "desconocido", 
                    },
                    update: {
                        nombre,
                        apellido
                    }
                });
                return true;
            } catch (error) {
                console.error("Error en autenticación:", error);
                return false;
            }
        },
        async jwt({ token }) {
            // Obtener el ID del usuario
            if (token.email) {
                const dbUser = await prisma.usuario.findUnique({
                    where: { email: token.email },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                }
            }
            return token;
        },
        session // Callback de sesión importado
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
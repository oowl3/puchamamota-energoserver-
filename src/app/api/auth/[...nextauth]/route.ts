import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { session } from '@/lib/session';

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
        async signIn({ profile }) {
            if (!profile?.email) {
                throw new Error('Perfil sin email');
            }

            try {
                const [nombre, apellido = ""] = profile.name?.split(" ") || ["", ""];
                
                // 1. Buscar rol existente primero por rol
                let rol = await prisma.usuarioRol.findFirst({
                    where: { rol: "usuario_normal" }
                });

                // Si no existe, crearlo
                if (!rol) {
                    rol = await prisma.usuarioRol.create({
                        data: { rol: "usuario_normal" }
                    });
                }

                // 2. Verificar si el usuario ya existe
                const usuarioExistente = await prisma.usuario.findUnique({
                    where: { email: profile.email },
                    select: { id: true, configuracionId: true }
                });

                // 3. Transacción solo para nuevos usuarios
                if (!usuarioExistente) {
                    await prisma.$transaction(async (tx) => {
                        const nuevaConfiguracion = await tx.usuarioConfiguracion.create({
                            data: {
                                periodoFacturacion: 30,
                                consumoInicial: 0,
                                consumoAnterior: 0,
                                consumoActual: 0,
                                tarifaId: 1,
                                metodoPago: "tarjeta",
                                planActualId: 1,
                            }
                        });

                        await tx.usuario.create({
                            data: {
                                email: profile.email!,
                                nombre,
                                apellido,
                                edad: 0,
                                genero: "desconocido",
                                configuracionId: nuevaConfiguracion.id,
                                rolId: rol!.id // Usamos el ! para asegurar que existe
                            }
                        });
                    });
                } else {
                    // Actualizar datos básicos del usuario existente
                    await prisma.usuario.update({
                        where: { email: profile.email },
                        data: {
                            nombre,
                            apellido,
                            rolId: rol!.id
                        }
                    });
                }

                return true;
            } catch (error) {
                console.error("Error en autenticación:", error);
                return false;
            }
        },
        async jwt({ token }) {
            if (token.email) {
                const dbUser = await prisma.usuario.findUnique({
                    where: { email: token.email },
                    include: {
                        rol: true,
                        configuracion: {
                            include: {
                                listaTarifa: true,
                                planDisponible: true
                            }
                        }
                    }
                });
                
                if (dbUser) {
                    token.id = dbUser.id;
                    token.rol = dbUser.rol?.rol;
                    token.configuracion = dbUser.configuracion;
                }
            }
            return token;
        },
        session
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
// src/app/api/auth/[...nextauth]/route.ts
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { session } from '@/lib/session';

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// Tipos para la conversión segura de BigInt
type BigIntToString<T> = T extends bigint 
? string
: T extends object
  ? { [K in keyof T]: BigIntToString<T[K]> }
  : T;

const convertirBigInt = <T>(obj: T): BigIntToString<T> => {
if (typeof obj === 'bigint') return obj.toString() as BigIntToString<T>;

if (obj && typeof obj === 'object') {
  if (Array.isArray(obj)) {
    return obj.map(convertirBigInt) as BigIntToString<T>;
  }
  
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, convertirBigInt(val)])
  ) as BigIntToString<T>;
}

return obj as BigIntToString<T>;
};

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
                
                // 1. Configurar tarifa por defecto
                let tarifaDefault = await prisma.listaTarifa.findFirst({
                    where: { tarifa: "Sin tarifa" }
                });

                if (!tarifaDefault) {
                    tarifaDefault = await prisma.listaTarifa.create({
                        data: {
                            tarifa: "Sin tarifa",
                        }
                    });
                }

                // 2. Configurar rol
                let rol = await prisma.usuarioRol.findFirst({
                    where: { rol: "usuario_normal" }
                });

                if (!rol) {
                    rol = await prisma.usuarioRol.create({
                        data: { rol: "usuario_normal" }
                    });
                }

                const usuarioExistente = await prisma.usuario.findUnique({
                    where: { email: profile.email }
                });

                if (!usuarioExistente) {
                    await prisma.$transaction(async (tx) => {
                        const nuevaConfiguracion = await tx.usuarioConfiguracion.create({
                            data: {
                                periodoFacturacion: "Enero-Febrero",
                                consumoAnterior: BigInt(0),
                                consumoActual: BigInt(0),
                                planActualId: BigInt(1),
                            }
                        });

                        const nuevoUsuario = await tx.usuario.create({
                            data: {
                                email: profile.email!,
                                nombre,
                                apellido,
                                tarifaId: tarifaDefault.id,
                                configuracionId: nuevaConfiguracion.id,
                                rolId: rol!.id
                            }
                        });

                        await tx.usuarioGrupo.create({
                            data: {
                                nombre: "CASA",
                                usuarioId: nuevoUsuario.id
                            }
                        });
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
                        listaTarifa: true,
                        configuracion: {
                            include: {
                                planDisponible: true
                            }
                        }
                    }
                });
                
                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.rol = dbUser.rol?.rol;
                    token.configuracion = convertirBigInt(dbUser.configuracion);
                    token.tarifa = convertirBigInt(dbUser.listaTarifa);
                }
            }
            return token;
        },
        session
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
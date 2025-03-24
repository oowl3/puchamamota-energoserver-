import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación actualizado (eliminado grupoId)
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  edad: z.string().regex(/^\d+$/, "Edad inválida").transform((v) => BigInt(v)),
  genero: z.string().min(1, "El género es requerido"),
  telefono: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  tokenId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  configuracionId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  rolId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
});

// POST - Crear usuario (actualizado)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        ...validatedData,
        // Eliminado grupoId de los datos
      }
    });

    // Conversión a string
    const responseData = {
      ...nuevoUsuario,
      id: nuevoUsuario.id.toString(),
      edad: nuevoUsuario.edad.toString(),
      telefono: nuevoUsuario.telefono?.toString(),
      tokenId: nuevoUsuario.tokenId?.toString(),
      configuracionId: nuevoUsuario.configuracionId?.toString(),
      rolId: nuevoUsuario.rolId?.toString(),
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// GET - Obtener todos los usuarios con grupos (actualizado)
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        grupos: {
          include: {
            dispositivos: true
          }
        }
      }
    });

    // Conversión de datos
    const usuariosConvertidos = usuarios.map(usuario => ({
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad.toString(),
      telefono: usuario.telefono?.toString(),
      tokenId: usuario.tokenId?.toString(),
      configuracionId: usuario.configuracionId?.toString(),
      rolId: usuario.rolId?.toString(),
      grupos: usuario.grupos.map(grupo => ({
        ...grupo,
        id: grupo.id.toString(),
        historialId: grupo.historialId?.toString(),
        dispositivos: grupo.dispositivos.map(dispositivo => ({
          ...dispositivo,
          id: dispositivo.id.toString(),
          ubicacionId: dispositivo.ubicacionId.toString(),
          grupoId: dispositivo.grupoId?.toString()
        }))
      }))
    }));

    return NextResponse.json(usuariosConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
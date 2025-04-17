// app/api/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación para actualización
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").optional(),
  email: z.string().email("Email inválido").optional(),
  apellido: z.string().nullish(),
  edad: z.string()
    .regex(/^\d+$/, "La edad debe ser un número entero positivo")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  genero: z.string().nullish(),
  telefono: z.string().nullish(),
  configuracionId: z.string()
    .regex(/^\d+$/, "ID de configuración inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  rolId: z.string()
    .regex(/^\d+$/, "ID de rol inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable()
});

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  context: { params: { [key: string]: string | string[] } }
) {
  try {
    const { id: idParam } = context.params as { id: string };
    
    // Validar y convertir ID
    const id = BigInt(idParam);
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        configuracion: true,
        rol: true,
        grupos: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Convertir BigInt a string
    const usuarioConvertido = {
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad?.toString() ?? null,
      configuracionId: usuario.configuracionId?.toString() ?? null,
      rolId: usuario.rolId?.toString() ?? null,
      configuracion: usuario.configuracion ? {
        ...usuario.configuracion,
        id: usuario.configuracion.id.toString()
      } : null,
      rol: usuario.rol ? {
        ...usuario.rol,
        id: usuario.rol.id.toString()
      } : null,
      grupos: usuario.grupos.map(grupo => ({
        ...grupo,
        id: grupo.id.toString(),
        usuarioId: grupo.usuarioId.toString()
      }))
    };

    return NextResponse.json(usuarioConvertido);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "ID inválido o error al obtener el usuario" },
      { status: 400 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  context: { params: { [key: string]: string | string[] } }
) {
  try {
    const { id: idParam } = context.params as { id: string };
    const id = BigInt(idParam);
    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: validatedData
    });

    const responseData = {
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
      edad: usuarioActualizado.edad?.toString() ?? null,
      configuracionId: usuarioActualizado.configuracionId?.toString() ?? null,
      rolId: usuarioActualizado.rolId?.toString() ?? null
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Usuario no encontrado o datos inválidos" },
      { status: 404 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  context: { params: { [key: string]: string | string[] } }
) {
  try {
    const { id: idParam } = context.params as { id: string };
    const id = BigInt(idParam);

    await prisma.usuario.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Usuario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Usuario no encontrado o no se pudo eliminar" },
      { status: 404 }
    );
  }
}
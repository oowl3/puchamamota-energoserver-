import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
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

// GET: Obtener usuario por ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validar que el ID existe
    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(id) }
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
      rolId: usuario.rolId?.toString() ?? null
    };

    return NextResponse.json(usuarioConvertido);
  } catch (error) {
    console.error("Error GET usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar usuario
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validar ID
    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: BigInt(id) },
      data: validatedData
    });

    // Convertir BigInt a string
    const responseData = {
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
      edad: usuarioActualizado.edad?.toString() ?? null,
      configuracionId: usuarioActualizado.configuracionId?.toString() ?? null,
      rolId: usuarioActualizado.rolId?.toString() ?? null
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error PUT usuario:", error);
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al actualizar el usuario" }, { status: 500 });
  }
}

// DELETE: Eliminar usuario
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validar ID
    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del usuario" },
        { status: 400 }
      );
    }

    await prisma.usuario.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { success: "Usuario eliminado correctamente" }
    );
  } catch (error) {
    console.error("Error DELETE usuario:", error);
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquemas de validación
const idSchema = z.string().regex(/^\d+$/, "ID inválido").transform(v => BigInt(v));

const usuarioUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  apellido: z.string().min(1, "El apellido es requerido").optional(),
  edad: z.string().regex(/^\d+$/, "Edad inválida").transform((v) => BigInt(v)).optional(),
  genero: z.string().min(1, "El género es requerido").optional(),
  telefono: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  tokenId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  configuracionId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  rolId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
  grupoId: z.string().regex(/^\d+$/).optional().transform((v) => v ? BigInt(v) : undefined),
});

// GET - Obtener usuario por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Acceso asincrónico del ID
    const idValidado = await idSchema.parseAsync(params.id);

    const usuario = await prisma.usuario.findUnique({
      where: { id: idValidado }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Conversión asincrónica de BigInt
    const usuarioConvertido = {
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad.toString(),
      telefono: usuario.telefono?.toString(),
      tokenId: usuario.tokenId?.toString(),
      configuracionId: usuario.configuracionId?.toString(),
      rolId: usuario.rolId?.toString(),
      grupoId: usuario.grupoId?.toString()
    };

    return NextResponse.json(usuarioConvertido);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    console.error("Error en GET:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Manejo asincrónico de múltiples promesas
    const [idValidado, body] = await Promise.all([
      idSchema.parseAsync(params.id),
      request.json()
    ]);
    
    const validatedData = await usuarioUpdateSchema.parseAsync(body);

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: idValidado },
      data: validatedData
    });

    const responseData = {
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
      edad: usuarioActualizado.edad.toString(),
      telefono: usuarioActualizado.telefono?.toString(),
      tokenId: usuarioActualizado.tokenId?.toString(),
      configuracionId: usuarioActualizado.configuracionId?.toString(),
      rolId: usuarioActualizado.rolId?.toString(),
      grupoId: usuarioActualizado.grupoId?.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("registro solicitado")) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    console.error("Error en PUT:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validación asincrónica del ID
    const idValidado = await idSchema.parseAsync(params.id);

    await prisma.usuario.delete({
      where: { id: idValidado }
    });

    return NextResponse.json(
      { mensaje: "Usuario eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("registro solicitado")) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    console.error("Error en DELETE:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
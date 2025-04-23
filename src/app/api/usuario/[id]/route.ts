// app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

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

// GET - Obtener usuario por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const idBigInt = BigInt(id);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: idBigInt }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const usuarioConvertido = {
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad?.toString() ?? null,
      configuracionId: usuario.configuracionId?.toString() ?? null,
      rolId: usuario.rolId?.toString() ?? null
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
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const idBigInt = BigInt(id);
    
    const body = await request.json();
    const validatedData = usuarioSchema.partial().parse(body);

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: idBigInt },
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
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const idBigInt = BigInt(id);
    
    const usuarioEliminado = await prisma.usuario.delete({
      where: { id: idBigInt }
    });

    const responseData = {
      ...usuarioEliminado,
      id: usuarioEliminado.id.toString(),
      edad: usuarioEliminado.edad?.toString() ?? null,
      configuracionId: usuarioEliminado.configuracionId?.toString() ?? null,
      rolId: usuarioEliminado.rolId?.toString() ?? null
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}
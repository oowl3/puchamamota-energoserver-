// src/app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const usuarioSchema = z.object({
  email: z.string().email("Email inválido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().optional().nullable(),
  edad: z.coerce.bigint().optional().nullable(),
  genero: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  tarifaId: z.coerce.bigint(),
  configuracionId: z.coerce.bigint().optional().nullable(),
  rolId: z.coerce.bigint().optional().nullable()
});

// GET Usuario por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        configuracion: true,
        rol: true,
        grupos: true,
        listaTarifa: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...usuario,
      id: usuario.id.toString(),
      tarifaId: usuario.tarifaId.toString(),
      configuracionId: usuario.configuracionId?.toString() ?? null,
      rolId: usuario.rolId?.toString() ?? null,
      edad: usuario.edad?.toString() ?? null,
      configuracion: usuario.configuracion ? {
        ...usuario.configuracion,
        id: usuario.configuracion.id.toString()
      } : null,
      rol: usuario.rol ? {
        ...usuario.rol,
        id: usuario.rol.id.toString()
      } : null,
      grupos: usuario.grupos.map(g => ({
        ...g,
        id: g.id.toString()
      })),
      listaTarifa: {
        ...usuario.listaTarifa,
        id: usuario.listaTarifa.id.toString()
      }
    });

  } catch (error) {
    console.error("Error GET usuario por ID:", error);
    return NextResponse.json(
      { error: "ID inválido o error en el servidor" },
      { status: 400 }
    );
  }
}

// PUT Actualizar usuario
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
      tarifaId: usuarioActualizado.tarifaId.toString(),
      configuracionId: usuarioActualizado.configuracionId?.toString() ?? null,
      rolId: usuarioActualizado.rolId?.toString() ?? null,
      edad: usuarioActualizado.edad?.toString() ?? null
    });

  } catch (error) {
    console.error("Error PUT usuario:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Usuario no encontrado o datos inválidos" },
      { status: 404 }
    );
  }
}

// DELETE Eliminar usuario
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    
    await prisma.usuario.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Usuario eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE usuario:", error);
    return NextResponse.json(
      { error: "Usuario no encontrado o ID inválido" },
      { status: 404 }
    );
  }
}
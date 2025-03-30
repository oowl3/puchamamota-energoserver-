import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  rol: z.string().min(3).optional(),
  permisoIds: z.array(z.coerce.bigint()).optional()
});

// GET - Obtener rol por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rolId = BigInt(id);

    const rol = await prisma.usuarioRol.findUnique({
      where: { id: rolId },
      include: { permisos: true }
    });

    if (!rol) {
      return NextResponse.json(
        { error: "Rol no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...rol,
      id: rol.id.toString(),
      permisos: rol.permisos.map(p => p.id.toString())
    });
  } catch (error) {
    console.error("Error GET:", error);
    return NextResponse.json(
      { error: "Error al obtener rol" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar rol
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rolId = BigInt(id);
    
    const body = await request.json();
    const validatedData = updateSchema.parse(body);

    const rolActualizado = await prisma.usuarioRol.update({
      where: { id: rolId },
      data: {
        rol: validatedData.rol,
        permisos: validatedData.permisoIds ? {
          set: validatedData.permisoIds.map(id => ({ id }))
        } : undefined
      },
      include: { permisos: true }
    });

    return NextResponse.json({
      ...rolActualizado,
      id: rolActualizado.id.toString(),
      permisos: rolActualizado.permisos.map(p => p.id.toString())
    });
  } catch (error) {
    console.error("Error PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar rol" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar rol
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rolId = BigInt(id);

    await prisma.usuarioRol.delete({
      where: { id: rolId }
    });

    return NextResponse.json(
      { mensaje: "Rol eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error DELETE:", error);
    return NextResponse.json(
      { error: "Error al eliminar rol" },
      { status: 500 }
    );
  }
}
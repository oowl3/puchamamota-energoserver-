// app/api/rol-permisos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updatePermisoSchema = z.object({
  permiso: z.string().min(3, "El permiso debe tener al menos 3 caracteres").optional()
});

// GET - Obtener permiso por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    const permiso = await prisma.rolPermiso.findUnique({
      where: { id },
      include: { usuarioRols: true }
    });

    if (!permiso) {
      return NextResponse.json(
        { error: "Permiso no encontrado" },
        { status: 404 }
      );
    }

    const responseData = {
      ...permiso,
      id: permiso.id.toString(),
      usuarioRols: permiso.usuarioRols.map(rol => ({
        ...rol,
        id: rol.id.toString()
      }))
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en GET por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener permiso" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar permiso
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    const body = await request.json();
    const validatedData = updatePermisoSchema.parse(body);

    const permisoActualizado = await prisma.rolPermiso.update({
      where: { id },
      data: validatedData
    });

    const responseData = {
      ...permisoActualizado,
      id: permisoActualizado.id.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar permiso" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar permiso
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    await prisma.rolPermiso.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    // Manejo seguro de errores de Prisma
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Permiso no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar permiso" },
      { status: 500 }
    );
  }
}
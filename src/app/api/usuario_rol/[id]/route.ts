// app/api/usuario-rol/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updateUsuarioRolSchema = z.object({
  rol: z.string().min(3, "El rol debe tener al menos 3 caracteres").optional(),
  permisoIds: z.array(
    z.coerce.string()
      .regex(/^\d+$/, "ID de permiso inválido")
      .transform(BigInt)
  ).optional()
});

// GET - Obtener un rol por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const rol = await prisma.usuarioRol.findUnique({
      where: { id: BigInt(params.id) },
      include: {
        permisos: true,
        usuarios: true
      }
    });

    if (!rol) {
      return NextResponse.json(
        { error: "Rol no encontrado" },
        { status: 404 }
      );
    }

    const rolConvertido = {
      ...rol,
      id: rol.id.toString(),
      permisos: rol.permisos.map(permiso => ({
        ...permiso,
        id: permiso.id.toString()
      })),
      usuarios: rol.usuarios.map(usuario => ({
        ...usuario,
        id: usuario.id.toString()
      }))
    };

    return NextResponse.json(rolConvertido);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener el rol" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un rol
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateUsuarioRolSchema.parse(body);

    const rolActualizado = await prisma.usuarioRol.update({
      where: { id: BigInt(params.id) },
      data: {
        rol: validatedData.rol,
        permisos: validatedData.permisoIds ? {
          set: validatedData.permisoIds.map(id => ({ id: BigInt(id) }))
        } : undefined
      },
      include: {
        permisos: true
      }
    });

    const responseData = {
      ...rolActualizado,
      id: rolActualizado.id.toString(),
      permisos: rolActualizado.permisos.map(permiso => ({
        ...permiso,
        id: permiso.id.toString()
      }))
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
      { error: "Error al actualizar el rol" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un rol
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.usuarioRol.delete({
      where: { id: BigInt(params.id) }
    });

    return NextResponse.json(
      { mensaje: "Rol eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error al eliminar el rol" },
      { status: 500 }
    );
  }
}
// app/api/usuario-rol/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquemas de validación
const usuarioRolSchema = z.object({
  rol: z.string().min(3, "El rol debe tener al menos 3 caracteres"),
  permisoIds: z.array(
    z.coerce.string()
      .regex(/^\d+$/, "ID de permiso inválido")
      .transform(BigInt)
  ).optional()
});

const updateUsuarioRolSchema = usuarioRolSchema.extend({
  rol: z.string().min(3, "El rol debe tener al menos 3 caracteres").optional()
});

// POST - Crear nuevo rol de usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = usuarioRolSchema.parse(body);

    const nuevoRol = await prisma.usuarioRol.create({
      data: {
        rol: validatedData.rol,
        permisos: {
          connect: validatedData.permisoIds?.map(id => ({ id })) || []
        }
      },
      include: {
        permisos: true
      }
    });

    const responseData = {
      ...nuevoRol,
      id: nuevoRol.id.toString(),
      permisos: nuevoRol.permisos.map(permiso => ({
        ...permiso,
        id: permiso.id.toString()
      }))
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear rol de usuario" },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los roles de usuario
export async function GET() {
  try {
    const roles = await prisma.usuarioRol.findMany({
      include: {
        permisos: true,
        usuarios: true
      }
    });

    const rolesConvertidos = roles.map((rol) => ({
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
    }));

    return NextResponse.json(rolesConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener roles de usuario" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un rol de usuario
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el parámetro ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateUsuarioRolSchema.parse(body);

    const rolActualizado = await prisma.usuarioRol.update({
      where: { id: BigInt(id) },
      data: {
        rol: validatedData.rol,
        permisos: validatedData.permisoIds ? {
          set: validatedData.permisoIds.map(id => ({ id }))
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
      { error: "Error al actualizar rol de usuario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un rol de usuario
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el parámetro ID" },
        { status: 400 }
      );
    }

    await prisma.usuarioRol.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { mensaje: "Rol eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error al eliminar rol de usuario" },
      { status: 500 }
    );
  }
}
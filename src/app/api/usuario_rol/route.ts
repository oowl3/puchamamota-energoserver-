// app/api/usuario-rol/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const usuarioRolSchema = z.object({
  rol: z.string().min(3, "El rol debe tener al menos 3 caracteres"),
  permisoId: z.coerce.string()
    .regex(/^\d+$/, "ID de permiso inválido")
    .transform(BigInt)
    .optional()
});

// POST - Crear nuevo rol de usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = usuarioRolSchema.parse(body);

    const nuevoRol = await prisma.usuarioRol.create({
      data: {
        rol: validatedData.rol,
        permisoId: validatedData.permisoId
      }
    });

    const responseData = {
      ...nuevoRol,
      id: nuevoRol.id.toString(),
      permisoId: nuevoRol.permisoId?.toString() || null
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
        permiso: true,
        usuarios: true
      }
    });

    const rolesConvertidos = roles.map((rol) => ({
      ...rol,
      id: rol.id.toString(),
      permisoId: rol.permisoId?.toString() || null,
      permiso: rol.permiso ? {
        ...rol.permiso,
        id: rol.permiso.id.toString()
      } : null,
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
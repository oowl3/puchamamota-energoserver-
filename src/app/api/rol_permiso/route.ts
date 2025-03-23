// app/api/rol-permisos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const rolPermisoSchema = z.object({
  permiso: z.string().min(3, "El permiso debe tener al menos 3 caracteres")
});

// POST - Crear nuevo rol-permiso
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = rolPermisoSchema.parse(body);

    const nuevoPermiso = await prisma.rolPermiso.create({
      data: validatedData
    });

    const responseData = {
      ...nuevoPermiso,
      id: nuevoPermiso.id.toString()
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
      { error: "Error al crear permiso" },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los roles-permisos
export async function GET() {
  try {
    const permisos = await prisma.rolPermiso.findMany({
      include: {
        usuarioRols: true
      }
    });

    const permisosConvertidos = permisos.map((permiso) => ({
      ...permiso,
      id: permiso.id.toString(),
      usuarioRols: permiso.usuarioRols.map(rol => ({
        ...rol,
        id: rol.id.toString()
      }))
    }));

    return NextResponse.json(permisosConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener permisos" },
      { status: 500 }
    );
  }
}
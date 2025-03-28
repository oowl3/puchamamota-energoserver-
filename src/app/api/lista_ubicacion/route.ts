import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const ubicacionSchema = z.object({
  ubicacion: z.string().min(1, "La ubicación no puede estar vacía")
});

// GET: Obtener todas las ubicaciones
export async function GET() {
  try {
    const ubicaciones = await prisma.listaUbicacion.findMany();

    return NextResponse.json(
      ubicaciones.map(ubicacion => ({
        ...ubicacion,
        id: ubicacion.id.toString()
      }))
    );

  } catch (error) {
    console.error("Error GET ubicaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener ubicaciones" },
      { status: 500 }
    );
  }
}

// POST: Crear nueva ubicación
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ubicacionSchema.parse(body);

    const nuevaUbicacion = await prisma.listaUbicacion.create({
      data: {
        ubicacion: validatedData.ubicacion
      }
    });

    return NextResponse.json(
      {
        ...nuevaUbicacion,
        id: nuevaUbicacion.id.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST ubicación:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear ubicación" }, { status: 500 });
  }
}
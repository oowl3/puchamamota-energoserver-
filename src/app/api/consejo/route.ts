import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const consejoSchema = z.object({
  informacion: z.string().min(1, "La información no puede estar vacía")
});

// GET: Obtener todos los consejos
export async function GET() {
  try {
    const consejos = await prisma.consejo.findMany();

    return NextResponse.json(
      consejos.map(consejo => ({
        ...consejo,
        id: consejo.id.toString()
      }))
    );

  } catch (error) {
    console.error("Error GET consejos:", error);
    return NextResponse.json(
      { error: "Error al obtener consejos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo consejo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = consejoSchema.parse(body);

    const nuevoConsejo = await prisma.consejo.create({
      data: {
        informacion: validatedData.informacion
      }
    });

    return NextResponse.json(
      {
        ...nuevoConsejo,
        id: nuevoConsejo.id.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST consejo:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear consejo" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const informacionSchema = z.object({
  pregunta: z.string().nullable().optional(),
  respuesta: z.string().nullable().optional()
});

// POST - Crear nueva entrada
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = informacionSchema.parse(body);

    const nuevaInformacion = await prisma.informacion.create({
      data: validatedData
    });

    const responseData = {
      ...nuevaInformacion,
      id: nuevaInformacion.id.toString()
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las entradas
export async function GET() {
  try {
    const informaciones = await prisma.informacion.findMany();

    const informacionesConvertidas = informaciones.map((info) => ({
      ...info,
      id: info.id.toString()
    }));

    return NextResponse.json(informacionesConvertidas);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
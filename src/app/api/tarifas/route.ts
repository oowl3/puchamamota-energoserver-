// src/app/api/tarifas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const tarifaSchema = z.object({
  tarifa: z.string().min(2, "La tarifa debe tener al menos 2 caracteres")
});

// GET: Obtener todas las tarifas
export async function GET() {
  try {
    const tarifas = await prisma.listaTarifa.findMany();
    
    // Convertir BigInt a string
    const tarifasConvertidas = tarifas.map(tarifa => ({
      ...tarifa,
      id: tarifa.id.toString()
    }));

    return NextResponse.json(tarifasConvertidas);

  } catch (error) {
    console.error("Error GET tarifas:", error);
    return NextResponse.json(
      { error: "Error al obtener tarifas" },
      { status: 500 }
    );
  }
}

// POST: Crear nueva tarifa
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = tarifaSchema.parse(body);

    const nuevaTarifa = await prisma.listaTarifa.create({
      data: validatedData
    });

    // Convertir BigInt a string
    const responseData = {
      ...nuevaTarifa,
      id: nuevaTarifa.id.toString()
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error("Error POST tarifa:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear tarifa" },
      { status: 500 }
    );
  }
}
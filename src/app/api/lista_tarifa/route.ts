// src/app/api/tarifas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tarifaSchema = z.object({
  tarifa: z.string().min(2, "La tarifa debe tener al menos 2 caracteres")
});

// GET
export async function GET() {
  try {
    const tarifas = await prisma.listaTarifa.findMany();
    return NextResponse.json(
      tarifas.map(t => ({ ...t, id: t.id.toString() }))
    );

  } catch (error) {
    console.error("Error GET tarifas:", error);
    return NextResponse.json(
      { error: "Error al obtener tarifas" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = tarifaSchema.parse(body);
    
    const nuevaTarifa = await prisma.listaTarifa.create({
      data: validatedData
    });

    return NextResponse.json(
      { ...nuevaTarifa, id: nuevaTarifa.id.toString() },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST tarifa:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear tarifa" }, { status: 500 });
  }
}
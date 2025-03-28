// src/app/api/planes-disponibles/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const planSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional().default(""),
  duracion: z.number().int().positive("La duración debe ser un número positivo"),
  costo: z.number().int().nonnegative("El costo no puede ser negativo")
});

// GET: Obtener todos los planes
export async function GET() {
  try {
    const planes = await prisma.planDisponible.findMany();
    
    return NextResponse.json(
      planes.map(plan => ({
        ...plan,
        id: plan.id.toString(),
        duracion: plan.duracion.toString(),
        costo: plan.costo.toString()
      }))
    );

  } catch (error) {
    console.error("Error GET planes:", error);
    return NextResponse.json(
      { error: "Error al obtener planes" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo plan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = planSchema.parse({
      ...body,
      duracion: Number(body.duracion),
      costo: Number(body.costo)
    });

    const nuevoPlan = await prisma.planDisponible.create({
      data: {
        ...validatedData,
        duracion: BigInt(validatedData.duracion),
        costo: BigInt(validatedData.costo)
      }
    });

    return NextResponse.json(
      {
        ...nuevoPlan,
        id: nuevoPlan.id.toString(),
        duracion: nuevoPlan.duracion.toString(),
        costo: nuevoPlan.costo.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST plan:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear plan" }, { status: 500 });
  }
}
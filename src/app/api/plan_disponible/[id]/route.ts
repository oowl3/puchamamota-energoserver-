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

// Tipo para la respuesta
type PlanResponse = {
  id: string;
  nombre: string;
  descripcion?: string;
  duracion: string;
  costo: string;
};

// GET: Obtener todos los planes
export async function GET(): Promise<NextResponse<PlanResponse[] | { error: string }>> {
  try {
    const planes = await prisma.planDisponible.findMany();
    
    const responseData: PlanResponse[] = planes.map(plan => ({
      id: plan.id.toString(),
      nombre: plan.nombre,
      descripcion: plan.descripcion ?? undefined,
      duracion: plan.duracion.toString(),
      costo: plan.costo.toString()
    }));

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error GET planes:", error);
    return NextResponse.json(
      { error: "Error al obtener planes" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo plan
export async function POST(request: Request): Promise<NextResponse<PlanResponse | { error: string }>> {
  try {
    const body: unknown = await request.json();
    
    // Validar y convertir tipos
    const rawData = body as Record<string, unknown>;
    const validatedData = planSchema.parse({
      nombre: rawData.nombre,
      descripcion: rawData.descripcion,
      duracion: Number(rawData.duracion),
      costo: Number(rawData.costo)
    });

    // Crear en base de datos
    const nuevoPlan = await prisma.planDisponible.create({
      data: {
        nombre: validatedData.nombre,
        descripcion: validatedData.descripcion,
        duracion: BigInt(validatedData.duracion),
        costo: BigInt(validatedData.costo)
      }
    });

    // Convertir BigInt a string para respuesta
    const responseData: PlanResponse = {
      id: nuevoPlan.id.toString(),
      nombre: nuevoPlan.nombre,
      descripcion: nuevoPlan.descripcion ?? undefined,
      duracion: nuevoPlan.duracion.toString(),
      costo: nuevoPlan.costo.toString()
    };

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error("Error POST plan:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear plan" },
      { status: 500 }
    );
  }
}
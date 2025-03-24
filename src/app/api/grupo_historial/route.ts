import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const grupoHistorialSchema = z.object({
  periodo: z.coerce.number().int().nonnegative().optional(),
  fechaCorte: z.coerce.date().optional(),
  consumo: z.coerce.number().int().nonnegative().optional(),
});

// GET: Obtener todos los registros de historial de grupos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo');

    const historiales = await prisma.grupoHistorial.findMany({
      where: periodo ? { periodo: BigInt(periodo) } : {},
      include: { grupos: true }
    });

    return NextResponse.json(
      historiales.map(historial => ({
        ...historial,
        id: historial.id.toString(),
        periodo: historial.periodo?.toString(),
        fechaCorte: historial.fechaCorte?.toISOString(),
        consumo: historial.consumo?.toString(),
        grupos: historial.grupos.map(grupo => ({
          ...grupo,
          id: grupo.id.toString(),
          // Convertir otros campos BigInt aquí si es necesario
        }))
      }))
    );

  } catch (error) {
    console.error("Error GET GrupoHistorial:", error);
    return NextResponse.json(
      { error: "Error al obtener el historial de grupos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo registro en el historial de grupos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = grupoHistorialSchema.parse(body);

    const nuevoHistorial = await prisma.grupoHistorial.create({
      data: {
        periodo: validatedData.periodo ? BigInt(validatedData.periodo) : null,
        fechaCorte: validatedData.fechaCorte,
        consumo: validatedData.consumo ? BigInt(validatedData.consumo) : null,
      }
    });

    return NextResponse.json(
      {
        ...nuevoHistorial,
        id: nuevoHistorial.id.toString(),
        periodo: nuevoHistorial.periodo?.toString(),
        fechaCorte: nuevoHistorial.fechaCorte?.toISOString(),
        consumo: nuevoHistorial.consumo?.toString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST GrupoHistorial:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear el registro histórico" }, { status: 500 });
  }
}
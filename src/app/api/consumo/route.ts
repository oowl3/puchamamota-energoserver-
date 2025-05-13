import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const consumoSchema = z.object({
  codigoesp: z.string().min(1, "El código ESP es requerido"),
  voltaje: z.number().positive("El voltaje debe ser un número positivo"),
  corriente: z.number().positive("La corriente debe ser un número positivo"),
  potencia: z.number().positive("La potencia debe ser un número positivo"),
  energia: z.number().positive("La energía debe ser un número positiva"),
});

// GET: Obtener todos los registros de consumo
export async function GET() {
  try {
    const consumos = await prisma.consumo.findMany({
      include: {
        dispositivo: true,
      },
      orderBy: {
        fechaHora: "desc",
      },
    });

    return NextResponse.json(
      consumos.map((consumo) => ({
        ...consumo,
        id: consumo.id.toString(),
        voltaje: consumo.voltaje.toString(),
        corriente: consumo.corriente.toString(),
        potencia: consumo.potencia.toString(),
        energia: consumo.energia.toString(),
        fechaHora: consumo.fechaHora.toISOString(),
        dispositivo: consumo.dispositivo
          ? {
              ...consumo.dispositivo,
              id: consumo.dispositivo.id.toString(),
            }
          : null,
      }))
    );
  } catch (error) {
    console.error("Error GET consumos:", error);
    return NextResponse.json(
      { error: "Error al obtener los registros de consumo" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo registro de consumo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = consumoSchema.parse(body);

    const nuevoConsumo = await prisma.consumo.create({
      data: {
        codigoesp: validatedData.codigoesp,
        voltaje: validatedData.voltaje,
        corriente: validatedData.corriente,
        potencia: validatedData.potencia,
        energia: validatedData.energia,
      },
      include: {
        dispositivo: true,
      },
    });

    return NextResponse.json(
      {
        ...nuevoConsumo,
        id: nuevoConsumo.id.toString(),
        voltaje: nuevoConsumo.voltaje.toString(),
        corriente: nuevoConsumo.corriente.toString(),
        potencia: nuevoConsumo.potencia.toString(),
        energia: nuevoConsumo.energia.toString(),
        fechaHora: nuevoConsumo.fechaHora.toISOString(),
        dispositivo: nuevoConsumo.dispositivo
          ? {
              ...nuevoConsumo.dispositivo,
              id: nuevoConsumo.dispositivo.id.toString(),
            }
          : null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error POST consumo:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear registro de consumo" },
      { status: 500 }
    );
  }
}
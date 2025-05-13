import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación para parámetros de ruta
const paramsSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID debe ser un número válido"),
});

// GET: Obtener un consumo por ID
export async function GET(request: Request, { params }: { params: unknown }) {
  try {
    // Validar parámetros de la ruta
    const { id } = paramsSchema.parse(params);
    const consumoId = parseInt(id, 10);

    const consumo = await prisma.consumo.findUnique({
      where: { id: consumoId },
      include: {
        dispositivo: true,
      },
    });

    if (!consumo) {
      return NextResponse.json(
        { error: "Registro de consumo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });

  } catch (error) {
    console.error("Error GET consumo por ID:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al obtener el registro de consumo" },
      { status: 500 }
    );
  }
}
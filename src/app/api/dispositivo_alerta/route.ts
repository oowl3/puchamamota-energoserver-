import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const alertaSchema = z.object({
  nombreAlerta: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  consumoLimite: z.number().int().nonnegative("El consumo límite no puede ser negativo"),
  tiempo: z.number().int().nonnegative("El tiempo no puede ser negativo"),
  acciones: z.string().min(1, "Debe especificar al menos una acción")
});

// GET: Obtener todas las alertas
export async function GET() {
  try {
    const alertas = await prisma.dispositivoAlerta.findMany({
      include: { dispositivos: true }
    });

    return NextResponse.json(
      alertas.map(alerta => ({
        ...alerta,
        id: alerta.id.toString(),
        consumoLimite: alerta.consumoLimite.toString(),
        tiempo: alerta.tiempo.toString(),
        dispositivos: alerta.dispositivos.map(dispositivo => ({
          ...dispositivo,
          id: dispositivo.id.toString(),
          // Convertir otros campos BigInt si existen
        }))
      }))
    );

  } catch (error) {
    console.error("Error GET alertas:", error);
    return NextResponse.json(
      { error: "Error al obtener las alertas" },
      { status: 500 }
    );
  }
}

// POST: Crear nueva alerta
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = alertaSchema.parse({
      ...body,
      consumoLimite: Number(body.consumoLimite),
      tiempo: Number(body.tiempo)
    });

    const nuevaAlerta = await prisma.dispositivoAlerta.create({
      data: {
        nombreAlerta: validatedData.nombreAlerta,
        consumoLimite: BigInt(validatedData.consumoLimite),
        tiempo: BigInt(validatedData.tiempo),
        acciones: validatedData.acciones
      }
    });

    return NextResponse.json(
      {
        ...nuevaAlerta,
        id: nuevaAlerta.id.toString(),
        consumoLimite: nuevaAlerta.consumoLimite.toString(),
        tiempo: nuevaAlerta.tiempo.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST alerta:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear la alerta" }, { status: 500 });
  }
}
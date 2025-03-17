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

// GET: Obtener alerta por ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const alerta = await prisma.dispositivoAlerta.findUnique({
      where: { id: BigInt(params.id) },
      include: { dispositivos: true }
    });

    if (!alerta) {
      return NextResponse.json(
        { error: "Alerta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...alerta,
      id: alerta.id.toString(),
      consumoLimite: alerta.consumoLimite.toString(),
      tiempo: alerta.tiempo.toString(),
      dispositivos: alerta.dispositivos.map(dispositivo => ({
        ...dispositivo,
        id: dispositivo.id.toString()
      }))
    });

  } catch (error) {
    console.error("Error GET alerta por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener la alerta" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar alerta
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const validatedData = alertaSchema.parse({
      ...body,
      consumoLimite: Number(body.consumoLimite),
      tiempo: Number(body.tiempo)
    });

    const alertaActualizada = await prisma.dispositivoAlerta.update({
      where: { id: BigInt(params.id) },
      data: {
        nombreAlerta: validatedData.nombreAlerta,
        consumoLimite: BigInt(validatedData.consumoLimite),
        tiempo: BigInt(validatedData.tiempo),
        acciones: validatedData.acciones
      }
    });

    return NextResponse.json({
      ...alertaActualizada,
      id: alertaActualizada.id.toString(),
      consumoLimite: alertaActualizada.consumoLimite.toString(),
      tiempo: alertaActualizada.tiempo.toString()
    });

  } catch (error) {
    console.error("Error PUT alerta:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar la alerta" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar alerta
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    await prisma.dispositivoAlerta.delete({
      where: { id: BigInt(params.id) }
    });

    return NextResponse.json(
      { message: "Alerta eliminada correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE alerta:", error);
    return NextResponse.json(
      { error: "Error al eliminar la alerta" },
      { status: 500 }
    );
  }
}
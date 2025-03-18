// app/api/dispositivos/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización (campos opcionales)
const updateDispositivoSchema = z.object({
  medicion: z.coerce.string()
    .regex(/^\d+$/, "La medición debe ser un número entero positivo")
    .transform(BigInt)
    .optional(),
  tiempoConexion: z.coerce.string()
    .regex(/^\d+$/, "El tiempo de conexión debe ser un número entero positivo")
    .transform(BigInt)
    .optional()
});

// GET - Obtener dispositivo por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    const dispositivo = await prisma.dispositivoConsumo.findUnique({
      where: { id }
    });

    if (!dispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    // Convertir BigInt a strings
    const responseData = {
      ...dispositivo,
      id: dispositivo.id.toString(),
      medicion: dispositivo.medicion.toString(),
      tiempoConexion: dispositivo.tiempoConexion.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en GET por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener dispositivo" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar dispositivo existente
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    const body = await request.json();
    const validatedData = updateDispositivoSchema.parse(body);

    const dispositivoActualizado = await prisma.dispositivoConsumo.update({
      where: { id },
      data: validatedData
    });

    // Convertir BigInt a strings
    const responseData = {
      ...dispositivoActualizado,
      id: dispositivoActualizado.id.toString(),
      medicion: dispositivoActualizado.medicion.toString(),
      tiempoConexion: dispositivoActualizado.tiempoConexion.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar dispositivo" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar dispositivo
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    await prisma.dispositivoConsumo.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar dispositivo" },
      { status: 500 }
    );
  }
}
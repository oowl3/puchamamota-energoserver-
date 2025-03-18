// app/api/config/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updateUsuarioConfigSchema = z.object({
  // ... (mantener mismo schema)
});

// GET - Obtener configuración por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    const configuracion = await prisma.usuarioConfiguracion.findUnique({
      where: { id }
    });

    if (!configuracion) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    // Conversión de BigInt a strings
    const responseData = {
      ...configuracion,
      id: configuracion.id.toString(),
      idiomaId: configuracion.idiomaId.toString(),
      periodoFacturacion: configuracion.periodoFacturacion.toString(),
      consumoInicial: configuracion.consumoInicial.toString(),
      consumoAnterior: configuracion.consumoAnterior.toString(),
      consumoActual: configuracion.consumoActual.toString(),
      tarifaId: configuracion.tarifaId.toString(),
      planActualId: configuracion.planActualId.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en GET por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración existente
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    const body = await request.json();
    const validatedData = updateUsuarioConfigSchema.parse(body);

    // Conversión de campos
    const data: any = {};
    for (const [key, value] of Object.entries(validatedData)) {
      if (value !== undefined) {
        data[key] = key.endsWith('Id') || key.startsWith('consumo') || key.startsWith('periodo') 
          ? BigInt(value as string)
          : value;
      }
    }

    const configActualizada = await prisma.usuarioConfiguracion.update({
      where: { id },
      data
    });

    // Conversión de BigInt a strings
    const responseData = {
      ...configActualizada,
      id: configActualizada.id.toString(),
      idiomaId: configActualizada.idiomaId.toString(),
      periodoFacturacion: configActualizada.periodoFacturacion.toString(),
      consumoInicial: configActualizada.consumoInicial.toString(),
      consumoAnterior: configActualizada.consumoAnterior.toString(),
      consumoActual: configActualizada.consumoActual.toString(),
      tarifaId: configActualizada.tarifaId.toString(),
      planActualId: configActualizada.planActualId.toString()
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
      { error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar configuración
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    await prisma.usuarioConfiguracion.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar configuración" },
      { status: 500 }
    );
  }
}
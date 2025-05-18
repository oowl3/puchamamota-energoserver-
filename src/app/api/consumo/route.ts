// app/api/consumos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Esquema para actualización
const updateConsumoSchema = z.object({
  voltaje: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido").optional(),
  corriente: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido").optional(),
  potencia: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido").optional(),
  energia: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido").optional(),
  fechaHora: z.string().datetime().optional()
});

// GET: Obtener consumo por ID
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "Formato de ID inválido" },
        { status: 400 }
      );
    }

    const consumo = await prisma.consumo.findUnique({
      where: { id: BigInt(params.id) },
      include: { dispositivo: true }
    });

    return consumo 
      ? NextResponse.json(transformConsumo(consumo))
      : NextResponse.json({ error: "No encontrado" }, { status: 404 });
      
  } catch (error) {
    console.error("Error GET consumo:", error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar consumo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validación de ID
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Validación de datos
    const body = await request.json();
    const validatedData = updateConsumoSchema.parse(body);
    
    // Construir datos de actualización
    const updateData: Record<string, any> = {};
    
    if (validatedData.voltaje) 
      updateData.voltaje = new Prisma.Decimal(validatedData.voltaje);
    
    if (validatedData.corriente) 
      updateData.corriente = new Prisma.Decimal(validatedData.corriente);
    
    if (validatedData.potencia) 
      updateData.potencia = new Prisma.Decimal(validatedData.potencia);
    
    if (validatedData.energia) 
      updateData.energia = new Prisma.Decimal(validatedData.energia);
    
    if (validatedData.fechaHora) 
      updateData.fechaHora = new Date(validatedData.fechaHora);

    // Ejecutar actualización
    const updatedConsumo = await prisma.consumo.update({
      where: { id: BigInt(params.id) },
      data: updateData,
      include: { dispositivo: true }
    });

    return NextResponse.json(transformConsumo(updatedConsumo));
    
  } catch (error) {
    console.error("Error PUT consumo:", error);
    
    // Manejo de errores de validación
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    // Manejo de errores de base de datos
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Consumo no encontrado" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error en la actualización" },
      { status: 500 }
    );
  }
}

// Funciones de transformación (las mismas que en el otro archivo)
const transformConsumo = (consumo: any) => ({
  ...consumo,
  id: consumo.id.toString(),
  voltaje: consumo.voltaje.toString(),
  corriente: consumo.corriente.toString(),
  potencia: consumo.potencia.toString(),
  energia: consumo.energia.toString(),
  fechaHora: consumo.fechaHora.toISOString(),
  dispositivo: consumo.dispositivo ? transformDispositivo(consumo.dispositivo) : null
});

const transformDispositivo = (dispositivo: any) => ({
  ...dispositivo,
  id: dispositivo.id.toString(),
  consumoAparatoSug: dispositivo.consumoAparatoSug.toString(),
  ubicacionId: dispositivo.ubicacionId.toString(),
  grupoId: dispositivo.grupoId?.toString() ?? null
});
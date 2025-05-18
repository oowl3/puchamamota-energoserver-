// app/api/consumos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma, Consumo, Dispositivo } from "@prisma/client";

// Tipos para transformación
type TransformedDispositivo = Omit<Dispositivo, 
  'id' | 'consumoAparatoSug' | 'ubicacionId' | 'grupoId'> & {
  id: string;
  consumoAparatoSug: string;
  ubicacionId: string;
  grupoId: string | null;
};

type TransformedConsumo = Omit<Consumo, 
  'id' | 'voltaje' | 'corriente' | 'potencia' | 'energia' | 'fechaHora'> & {
  id: string;
  voltaje: string;
  corriente: string;
  potencia: string;
  energia: string;
  fechaHora: string;
  dispositivo: TransformedDispositivo | null;
};

// Esquema de validación para POST
const consumoPostSchema = z.object({
  codigoesp: z.string().min(1, "Código ESP requerido"),
  voltaje: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido"),
  corriente: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido"),
  potencia: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido"),
  energia: z.string().regex(/^\d+\.?\d*$/, "Valor decimal inválido"),
  fechaHora: z.string().datetime().optional()
});

// Función de transformación reusable
const transformConsumo = (
  consumo: Consumo & { dispositivo?: Dispositivo | null }
): TransformedConsumo => ({
  ...consumo,
  id: consumo.id.toString(),
  voltaje: consumo.voltaje.toString(),
  corriente: consumo.corriente.toString(),
  potencia: consumo.potencia.toString(),
  energia: consumo.energia.toString(),
  fechaHora: consumo.fechaHora.toISOString(),
  dispositivo: consumo.dispositivo ? transformDispositivo(consumo.dispositivo) : null
});

const transformDispositivo = (dispositivo: Dispositivo): TransformedDispositivo => ({
  ...dispositivo,
  id: dispositivo.id.toString(),
  consumoAparatoSug: dispositivo.consumoAparatoSug.toString(),
  ubicacionId: dispositivo.ubicacionId.toString(),
  grupoId: dispositivo.grupoId?.toString() ?? null
});

// GET: Obtener todos los consumos
export async function GET() {
  try {
    const consumos = await prisma.consumo.findMany({
      include: { dispositivo: true },
      orderBy: { fechaHora: "desc" }
    });

    return NextResponse.json(consumos.map(transformConsumo));
  } catch (error) {
    console.error("Error GET consumos:", error);
    return NextResponse.json(
      { error: "Error al obtener los consumos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo consumo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = consumoPostSchema.parse(body);

    const nuevoConsumo = await prisma.consumo.create({
      data: {
        codigoesp: validatedData.codigoesp,
        voltaje: new Prisma.Decimal(validatedData.voltaje),
        corriente: new Prisma.Decimal(validatedData.corriente),
        potencia: new Prisma.Decimal(validatedData.potencia),
        energia: new Prisma.Decimal(validatedData.energia),
        fechaHora: validatedData.fechaHora ? new Date(validatedData.fechaHora) : undefined
      },
      include: { dispositivo: true }
    });

    return NextResponse.json(transformConsumo(nuevoConsumo), { status: 201 });
  } catch (error) {
    console.error("Error POST consumo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Error de validación",
          detalles: error.errors.map(e => e.message) 
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "El código ESP no existe" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al crear el consumo" },
      { status: 500 }
    );
  }
}
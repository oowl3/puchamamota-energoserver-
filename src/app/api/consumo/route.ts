// src/app/api/consumos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const consumoSchema = z.object({
  codigoesp: z.string().min(1, "El código ESP es requerido"),
  voltaje: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ej: 120.50)")
    .transform(v => new Prisma.Decimal(v)),
  corriente: z.string()
    .regex(/^\d+(\.\d{1,3})?$/, "Formato inválido (ej: 2.450)")
    .transform(v => new Prisma.Decimal(v)),
  potencia: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ej: 300.75)")
    .transform(v => new Prisma.Decimal(v)),
  energia: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ej: 5.50)")
    .transform(v => new Prisma.Decimal(v)),
  fechaHora: z.string().datetime().optional()
});

// GET todos los consumos
export async function GET() {
  try {
    const consumos = await prisma.consumo.findMany({
      orderBy: { fechaHora: 'desc' },
      include: { dispositivo: true }
    });

    return NextResponse.json(consumos.map(c => ({
      ...c,
      id: c.id.toString(),
      voltaje: c.voltaje.toString(),
      corriente: c.corriente.toString(),
      potencia: c.potencia.toString(),
      energia: c.energia.toString(),
      fechaHora: c.fechaHora.toISOString(),
      dispositivo: c.dispositivo ? {
        ...c.dispositivo,
        id: c.dispositivo.id.toString(),
        consumoAparatoSug: c.dispositivo.consumoAparatoSug.toString(),
        grupoId: c.dispositivo.grupoId?.toString() ?? null
      } : null
    })));

  } catch (error) {
    console.error("Error GET consumos:", error);
    return NextResponse.json(
      { error: "Error al obtener los consumos" },
      { status: 500 }
    );
  }
}

// POST nuevo consumo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = consumoSchema.parse(body);

    // Verificar existencia del dispositivo
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { codigoesp: validatedData.codigoesp }
    });

    if (!dispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    const nuevoConsumo = await prisma.consumo.create({
      data: {
        ...validatedData,
        fechaHora: validatedData.fechaHora ? new Date(validatedData.fechaHora) : undefined
      }
    });

    return NextResponse.json({
      ...nuevoConsumo,
      id: nuevoConsumo.id.toString(),
      voltaje: nuevoConsumo.voltaje.toString(),
      corriente: nuevoConsumo.corriente.toString(),
      potencia: nuevoConsumo.potencia.toString(),
      energia: nuevoConsumo.energia.toString(),
      fechaHora: nuevoConsumo.fechaHora.toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error("Error POST consumo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Registro duplicado" },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "Relación inválida con dispositivo" },
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
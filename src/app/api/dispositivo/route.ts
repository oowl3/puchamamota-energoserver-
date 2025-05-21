// src/app/api/dispositivos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const dispositivoSchema = z.object({
  nombreDispositivo: z.string().min(1, "El nombre del dispositivo es requerido"),
  consumoAparatoSug: z.string().regex(/^\d+$/, "Debe ser un número positivo").transform(BigInt),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  codigoesp: z.string().optional().nullable(),
  grupoId: z.string().regex(/^\d+$/).optional().nullable().transform(val => val ? BigInt(val) : null),
});

// GET todos los dispositivos con sus consumos
export async function GET() {
  try {
    const dispositivos = await prisma.dispositivo.findMany({
      include: {
        grupo: true,
        consumos: true
      }
    });

    return NextResponse.json(
      dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        consumoAparatoSug: d.consumoAparatoSug.toString(),
        grupoId: d.grupoId?.toString() ?? null,
        grupo: d.grupo ? {
          ...d.grupo,
          id: d.grupo.id.toString()
        } : null,
        consumos: d.consumos.map(c => ({
          ...c,
          id: c.id.toString(),
          // Campos corregidos según el modelo Consumo
          codigoesp: c.codigoesp,
          voltaje: c.voltaje.toString(),
          corriente: c.corriente.toString(),
          potencia: c.potencia.toString(),
          energia: c.energia.toString(),
          fechaHora: c.fechaHora.toISOString()
        }))
      }))
    );

  } catch (error) {
    console.error("Error GET dispositivos:", error);
    return NextResponse.json(
      { error: "Error al obtener dispositivos" },
      { status: 500 }
    );
  }
}

// POST nuevo dispositivo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = dispositivoSchema.parse(body);

    const nuevoDispositivo = await prisma.dispositivo.create({
      data: {
        ...validatedData,
        consumos: undefined // Aseguramos que no se intenten crear consumos desde aquí
      }
    });

    return NextResponse.json({
      ...nuevoDispositivo,
      id: nuevoDispositivo.id.toString(),
      consumoAparatoSug: nuevoDispositivo.consumoAparatoSug.toString(),
      grupoId: nuevoDispositivo.grupoId?.toString() ?? null
    }, { status: 201 });

  } catch (error) {
    console.error("Error POST dispositivo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "El código ESP ya está en uso" },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "El grupo especificado no existe" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
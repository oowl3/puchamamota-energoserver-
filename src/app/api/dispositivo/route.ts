// src/app/api/dispositivos/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const dispositivoSchema = z.object({
  codigoesp: z.string().optional().nullable(),
  nombreDispositivo: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  consumoAparatoSug: z.number().positive("El consumo debe ser un número positivo"),
  ubicacionId: z.number().positive("ID de ubicación inválido"),
  listaUbicacion: z.string().min(2, "Ubicación debe tener al menos 2 caracteres"),
  grupoId: z.number().positive("ID de grupo inválido").optional().nullable(),
});

// GET todos los dispositivos
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
        ubicacionId: d.ubicacionId.toString(),
        grupoId: d.grupoId?.toString()
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
    const validatedData = dispositivoSchema.parse({
      ...body,
      consumoAparatoSug: Number(body.consumoAparatoSug),
      ubicacionId: Number(body.ubicacionId),
      grupoId: body.grupoId ? Number(body.grupoId) : null
    });

    // Verificar código ESP único
    if (validatedData.codigoesp) {
      const existente = await prisma.dispositivo.findUnique({
        where: { codigoesp: validatedData.codigoesp }
      });
      
      if (existente) {
        return NextResponse.json(
          { error: "El código ESP ya está registrado" },
          { status: 400 }
        );
      }
    }

    const nuevoDispositivo = await prisma.dispositivo.create({
      data: validatedData
    });

    return NextResponse.json(
      {
        ...nuevoDispositivo,
        id: nuevoDispositivo.id.toString(),
        consumoAparatoSug: nuevoDispositivo.consumoAparatoSug.toString(),
        ubicacionId: nuevoDispositivo.ubicacionId.toString(),
        grupoId: nuevoDispositivo.grupoId?.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST dispositivo:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear dispositivo" }, { status: 500 });
  }
}
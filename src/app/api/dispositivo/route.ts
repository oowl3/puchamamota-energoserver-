import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const dispositivoSchema = z.object({
  codigoesp: z.string().nullable().optional().default(null),
  nombreDispositivo: z.string().min(1, "El nombre es requerido"),
  consumoAparatoSug: z
    .string()
    .regex(/^\d+$/, "Debe ser un número entero")
    .transform((v) => BigInt(v)),
  ubicacionId: z
    .string()
    .regex(/^\d+$/, "Debe ser un número entero")
    .transform((v) => BigInt(v)),
  grupoId: z
    .union([
      z.string().regex(/^\d+$/).transform((v) => BigInt(v)),
      z.null()
    ])
    .optional()
    .default(null),
});

// GET: Obtener todos los dispositivos
export async function GET() {
  try {
    const dispositivos = await prisma.dispositivo.findMany({
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    return NextResponse.json(
      dispositivos.map((dispositivo) => ({
        ...dispositivo,
        id: dispositivo.id.toString(),
        consumoAparatoSug: dispositivo.consumoAparatoSug.toString(),
        ubicacionId: dispositivo.ubicacionId.toString(),
        grupoId: dispositivo.grupoId?.toString() ?? null,
        listaUbicacion: dispositivo.listaUbicacion ? {
          ...dispositivo.listaUbicacion,
          id: dispositivo.listaUbicacion.id.toString(),
        } : null,
        grupo: dispositivo.grupo ? {
          ...dispositivo.grupo,
          id: dispositivo.grupo.id.toString(),
        } : null,
        consumos: dispositivo.consumos.map((consumo) => ({
          ...consumo,
          id: consumo.id.toString(),
        })),
      }))
    );
  } catch (error) {
    console.error("Error GET dispositivos:", error);
    return NextResponse.json(
      { error: "Error al obtener los dispositivos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo dispositivo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = dispositivoSchema.parse(body);

    const nuevoDispositivo = await prisma.dispositivo.create({
      data: {
        codigoesp: validatedData.codigoesp,
        nombreDispositivo: validatedData.nombreDispositivo,
        consumoAparatoSug: validatedData.consumoAparatoSug,
        ubicacionId: validatedData.ubicacionId,
        grupoId: validatedData.grupoId,
      },
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    return NextResponse.json(
      {
        ...nuevoDispositivo,
        id: nuevoDispositivo.id.toString(),
        consumoAparatoSug: nuevoDispositivo.consumoAparatoSug.toString(),
        ubicacionId: nuevoDispositivo.ubicacionId.toString(),
        grupoId: nuevoDispositivo.grupoId?.toString() ?? null,
        listaUbicacion: nuevoDispositivo.listaUbicacion ? {
          ...nuevoDispositivo.listaUbicacion,
          id: nuevoDispositivo.listaUbicacion.id.toString(),
        } : null,
        grupo: nuevoDispositivo.grupo ? {
          ...nuevoDispositivo.grupo,
          id: nuevoDispositivo.grupo.id.toString(),
        } : null,
        consumos: nuevoDispositivo.consumos.map((consumo) => ({
          ...consumo,
          id: consumo.id.toString(),
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error POST dispositivo:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear el dispositivo" },
      { status: 500 }
    );
  }
}
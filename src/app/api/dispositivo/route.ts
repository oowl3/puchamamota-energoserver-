import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const dispositivoSchema = z.object({
  indentificadorPropio: z.number().int().positive("El identificador propio debe ser un número positivo"),
  idSeguridad: z.number().int().positive("El ID de seguridad debe ser un número positivo"),
  numeroSerie: z.number().int().positive("El número de serie debe ser un número positivo"),
  nombreDispositivo: z.string().min(3, "El nombre del dispositivo debe tener al menos 3 caracteres"),
  ubicacionId: z.number().int().positive("El ID de ubicación debe ser un número positivo"),
  alertaId: z.number().int().optional(),
  aparatoId: z.number().int().optional(),
  consumoId: z.number().int().optional()
});

// GET: Obtener dispositivos
export async function GET(request: NextRequest) {
  try {
    const dispositivos = await prisma.dispositivo.findMany({
      include: {
        listaUbicacion: true,
        alerta: true,
        aparato: true,
        consumo: true,
        grupos: true,
        codigosSeguridad: true
      }
    });

    return NextResponse.json(
      dispositivos.map(dispositivo => ({
        ...dispositivo,
        id: dispositivo.id.toString(),
        indentificadorPropio: dispositivo.indentificadorPropio.toString(),
        idSeguridad: dispositivo.idSeguridad.toString(),
        numeroSerie: dispositivo.numeroSerie.toString(),
        ubicacionId: dispositivo.ubicacionId.toString(),
        alertaId: dispositivo.alertaId?.toString() || null,
        aparatoId: dispositivo.aparatoId?.toString() || null,
        consumoId: dispositivo.consumoId?.toString() || null
      }))
    );
  } catch (error) {
    console.error("Error GET dispositivos:", error);
    return NextResponse.json({ error: "Error al obtener dispositivos" }, { status: 500 });
  }
}

// POST: Crear nuevo dispositivo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = dispositivoSchema.parse(body);

    const nuevoDispositivo = await prisma.dispositivo.create({
      data: {
        indentificadorPropio: BigInt(validatedData.indentificadorPropio),
        idSeguridad: BigInt(validatedData.idSeguridad),
        numeroSerie: BigInt(validatedData.numeroSerie),
        nombreDispositivo: validatedData.nombreDispositivo,
        ubicacionId: BigInt(validatedData.ubicacionId),
        alertaId: validatedData.alertaId ? BigInt(validatedData.alertaId) : null,
        aparatoId: validatedData.aparatoId ? BigInt(validatedData.aparatoId) : null,
        consumoId: validatedData.consumoId ? BigInt(validatedData.consumoId) : null
      }
    });

    return NextResponse.json(
      {
        ...nuevoDispositivo,
        id: nuevoDispositivo.id.toString(),
        indentificadorPropio: nuevoDispositivo.indentificadorPropio.toString(),
        idSeguridad: nuevoDispositivo.idSeguridad.toString(),
        numeroSerie: nuevoDispositivo.numeroSerie.toString(),
        ubicacionId: nuevoDispositivo.ubicacionId.toString(),
        alertaId: nuevoDispositivo.alertaId?.toString() || null,
        aparatoId: nuevoDispositivo.aparatoId?.toString() || null,
        consumoId: nuevoDispositivo.consumoId?.toString() || null
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

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const dispositivoSchema = z.object({
  codigoEspUsuario: z.number().int().positive(),
  nombreDispositivo: z.string().min(1, "El nombre del dispositivo es requerido"),
  nombreAparato: z.string().min(1, "El nombre del aparato es requerido"),
  consumoAparatoSug: z.number().int().positive(),
  ubicacionId: z.number().int().positive(),
  grupoId: z.number().int().positive().optional()
});

// GET: Obtener todos los dispositivos
export async function GET() {
  try {
    const dispositivos = await prisma.dispositivo.findMany({
      include: {
        listaUbicacion: true,
        grupo: true
      }
    });

    return NextResponse.json(
      dispositivos.map(dispositivo => ({
        ...dispositivo,
        id: dispositivo.id.toString(),
        codigoEspUsuario: dispositivo.codigoEspUsuario.toString(),
        consumoAparatoSug: dispositivo.consumoAparatoSug.toString(),
        ubicacionId: dispositivo.ubicacionId.toString(),
        grupoId: dispositivo.grupoId?.toString()
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

// POST: Crear nuevo dispositivo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = dispositivoSchema.parse(body);

    const nuevoDispositivo = await prisma.dispositivo.create({
      data: {
        codigoEspUsuario: validatedData.codigoEspUsuario,
        nombreDispositivo: validatedData.nombreDispositivo,
        nombreAparato: validatedData.nombreAparato,
        consumoAparatoSug: validatedData.consumoAparatoSug,
        ubicacionId: validatedData.ubicacionId,
        grupoId: validatedData.grupoId
      },
      include: {
        listaUbicacion: true,
        grupo: true
      }
    });

    return NextResponse.json(
      {
        ...nuevoDispositivo,
        id: nuevoDispositivo.id.toString(),
        codigoEspUsuario: nuevoDispositivo.codigoEspUsuario.toString(),
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
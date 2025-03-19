import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const dispositivoAparatoSchema = z.object({
  aparatoConectadoId: z.coerce.number().int().positive("ID de aparato conectado inválido"),
  tiempoUso: z.coerce.number().int().nonnegative("El tiempo de uso no puede ser negativo").optional(),
  consumoEtiquetado: z.coerce.number().int().nonnegative("El consumo etiquetado no puede ser negativo").optional(),
});

// GET: Obtener dispositivos aparatos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const aparatoConectadoId = searchParams.get('aparatoConectadoId');

    const dispositivosAparatos = await prisma.dispositivoAparato.findMany({
      where: aparatoConectadoId 
        ? { aparatoConectadoId: BigInt(aparatoConectadoId) } 
        : {},
      include: {
        listaAparato: true,
        dispositivos: true
      }
    });

    return NextResponse.json(
      dispositivosAparatos.map(da => ({
        ...da,
        id: da.id.toString(),
        aparatoConectadoId: da.aparatoConectadoId.toString(),
        tiempoUso: da.tiempoUso?.toString(),
        consumoEtiquetado: da.consumoEtiquetado?.toString(),
        listaAparato: {
          ...da.listaAparato,
          id: da.listaAparato.id.toString(),
        },
        dispositivos: da.dispositivos.map(d => ({
          ...d,
          id: d.id.toString(),
        }))
      }))
    );

  } catch (error) {
    console.error("Error GET dispositivos aparatos:", error);
    return NextResponse.json(
      { error: "Error al obtener dispositivos aparatos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo dispositivo aparato
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = dispositivoAparatoSchema.parse(body);

    // Verificar existencia del aparato en ListaAparato
    const listaAparatoExiste = await prisma.listaAparato.findUnique({
      where: { id: BigInt(validatedData.aparatoConectadoId) }
    });

    if (!listaAparatoExiste) {
      return NextResponse.json(
        { error: "Aparato no encontrado en la lista" },
        { status: 404 }
      );
    }

    const nuevoDispositivoAparato = await prisma.dispositivoAparato.create({
      data: {
        aparatoConectadoId: BigInt(validatedData.aparatoConectadoId),
        ...(validatedData.tiempoUso !== undefined && { tiempoUso: BigInt(validatedData.tiempoUso) }),
        ...(validatedData.consumoEtiquetado !== undefined && { 
          consumoEtiquetado: BigInt(validatedData.consumoEtiquetado) 
        }),
      }
    });

    return NextResponse.json(
      {
        ...nuevoDispositivoAparato,
        id: nuevoDispositivoAparato.id.toString(),
        aparatoConectadoId: nuevoDispositivoAparato.aparatoConectadoId.toString(),
        tiempoUso: nuevoDispositivoAparato.tiempoUso?.toString(),
        consumoEtiquetado: nuevoDispositivoAparato.consumoEtiquetado?.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST dispositivo aparato:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear dispositivo aparato" }, { status: 500 });
  }
}
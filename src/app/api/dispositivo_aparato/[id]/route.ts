import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización (campos opcionales)
const updateDispositivoAparatoSchema = z.object({
  tiempoUso: z.coerce.number().int().nonnegative().optional(),
  consumoEtiquetado: z.coerce.number().int().nonnegative().optional(),
}).partial();

// GET: Obtener dispositivo aparato por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const idValidation = z.coerce.number().int().positive().safeParse(params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "ID de dispositivo inválido" },
        { status: 400 }
      );
    }
    const id = BigInt(params.id);

    // Buscar dispositivo
    const dispositivoAparato = await prisma.dispositivoAparato.findUnique({
      where: { id },
      include: {
        listaAparato: true,
        dispositivos: true
      }
    });

    if (!dispositivoAparato) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    // Convertir BigInt a strings
    return NextResponse.json({
      ...dispositivoAparato,
      id: dispositivoAparato.id.toString(),
      aparatoConectadoId: dispositivoAparato.aparatoConectadoId.toString(),
      tiempoUso: dispositivoAparato.tiempoUso?.toString(),
      consumoEtiquetado: dispositivoAparato.consumoEtiquetado?.toString(),
      listaAparato: {
        ...dispositivoAparato.listaAparato,
        id: dispositivoAparato.listaAparato.id.toString(),
      },
      dispositivos: dispositivoAparato.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
      }))
    });

  } catch (error) {
    console.error("Error GET dispositivo específico:", error);
    return NextResponse.json(
      { error: "Error al obtener el dispositivo" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar dispositivo aparato
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const idValidation = z.coerce.number().int().positive().safeParse(params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "ID de dispositivo inválido" },
        { status: 400 }
      );
    }
    const id = BigInt(params.id);

    // Validar cuerpo
    const body = await request.json();
    const validatedData = updateDispositivoAparatoSchema.parse(body);

    // Verificar existencia
    const existeDispositivo = await prisma.dispositivoAparato.findUnique({ where: { id } });
    if (!existeDispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar (SECCIÓN CORREGIDA)
    const updatedDispositivo = await prisma.dispositivoAparato.update({
      where: { id },
      data: {
        ...(validatedData.tiempoUso !== undefined && { 
          tiempoUso: BigInt(validatedData.tiempoUso) 
        }),
        ...(validatedData.consumoEtiquetado !== undefined && { 
          consumoEtiquetado: BigInt(validatedData.consumoEtiquetado) 
        }),
      }
    });

    return NextResponse.json({
      ...updatedDispositivo,
      id: updatedDispositivo.id.toString(),
      aparatoConectadoId: updatedDispositivo.aparatoConectadoId.toString(),
      tiempoUso: updatedDispositivo.tiempoUso?.toString(),
      consumoEtiquetado: updatedDispositivo.consumoEtiquetado?.toString()
    });

  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al actualizar dispositivo" }, { status: 500 });
  }
}

// DELETE: Eliminar dispositivo aparato
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const idValidation = z.coerce.number().int().positive().safeParse(params.id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "ID de dispositivo inválido" },
        { status: 400 }
      );
    }
    const id = BigInt(params.id);

    // Verificar existencia
    const existeDispositivo = await prisma.dispositivoAparato.findUnique({ where: { id } });
    if (!existeDispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar
    await prisma.dispositivoAparato.delete({ where: { id } });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    return NextResponse.json(
      { error: "Error al eliminar dispositivo" },
      { status: 500 }
    );
  }
}
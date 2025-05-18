// app/api/dispositivos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización (campos opcionales)
const dispositivoUpdateSchema = z.object({
  codigoesp: z.string().nullable().optional(),
  nombreDispositivo: z.string().min(1, "El nombre es requerido").optional(),
  consumoAparatoSug: z
    .string()
    .regex(/^\d+$/, "Debe ser un número entero")
    .transform((v) => BigInt(v))
    .optional(),
  ubicacionId: z
    .string()
    .regex(/^\d+$/, "Debe ser un número entero")
    .transform((v) => BigInt(v))
    .optional(),
  grupoId: z
    .union([
      z.string().regex(/^\d+$/).transform((v) => BigInt(v)),
      z.null()
    ])
    .optional()
});

// Helper para serializar BigInt
function serializeDispositivo(dispositivo: any) {
  return {
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
    consumos: dispositivo.consumos.map((consumo: any) => ({
      ...consumo,
      id: consumo.id.toString(),
    })),
  };
}

// GET: Obtener dispositivo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Obtener dispositivo
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id },
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true
      }
    });

    if (!dispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeDispositivo(dispositivo));

  } catch (error) {
    console.error("Error GET dispositivo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar dispositivo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Validar cuerpo
    const body = await request.json();
    const validatedData = dispositivoUpdateSchema.parse(body);

    // Actualizar dispositivo
    const updatedDispositivo = await prisma.dispositivo.update({
      where: { id },
      data: {
        ...validatedData,
        grupoId: validatedData.grupoId ?? undefined
      },
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true
      }
    });

    return NextResponse.json(serializeDispositivo(updatedDispositivo));

  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar dispositivo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Eliminar dispositivo
    await prisma.dispositivo.delete({
      where: { id }
    });

    return NextResponse.json(
      { success: true, message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
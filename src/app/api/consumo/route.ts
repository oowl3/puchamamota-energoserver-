// app/api/dispositivos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updateDispositivoSchema = z.object({
  codigoesp: z.string().nullable().optional(),
  nombreDispositivo: z.string().min(1).optional(),
  consumoAparatoSug: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => BigInt(v))
    .optional(),
  ubicacionId: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => BigInt(v))
    .optional(),
  grupoId: z
    .union([
      z.string().regex(/^\d+/).transform((v) => BigInt(v)),
      z.null()
    ])
    .optional(),
});

// GET: Obtener dispositivo por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dispositivoId = BigInt(params.id);

    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id: dispositivoId },
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    if (!dispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
      consumos: dispositivo.consumos.map((c) => ({
        ...c,
        id: c.id.toString(),
      })),
    });
    
  } catch (error) {
    console.error("Error GET dispositivo:", error);
    
    if (error instanceof Error && error.message.includes("Invalid value")) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener el dispositivo" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar dispositivo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dispositivoId = BigInt(params.id);
    const body = await request.json();
    const validatedData = updateDispositivoSchema.parse(body);

    const dispositivoActualizado = await prisma.dispositivo.update({
      where: { id: dispositivoId },
      data: {
        ...validatedData,
        // Manejar conversión explícita para campos opcionales
        grupoId: validatedData.grupoId ?? undefined,
      },
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    return NextResponse.json({
      ...dispositivoActualizado,
      id: dispositivoActualizado.id.toString(),
      consumoAparatoSug: dispositivoActualizado.consumoAparatoSug.toString(),
      ubicacionId: dispositivoActualizado.ubicacionId.toString(),
      grupoId: dispositivoActualizado.grupoId?.toString() ?? null,
      listaUbicacion: dispositivoActualizado.listaUbicacion ? {
        ...dispositivoActualizado.listaUbicacion,
        id: dispositivoActualizado.listaUbicacion.id.toString(),
      } : null,
      grupo: dispositivoActualizado.grupo ? {
        ...dispositivoActualizado.grupo,
        id: dispositivoActualizado.grupo.id.toString(),
      } : null,
      consumos: dispositivoActualizado.consumos.map((c) => ({
        ...c,
        id: c.id.toString(),
      })),
    });

  } catch (error) {
    console.error("Error PUT dispositivo:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar el dispositivo" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar dispositivo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dispositivoId = BigInt(params.id);

    await prisma.dispositivo.delete({
      where: { id: dispositivoId },
    });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);

    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar el dispositivo" },
      { status: 500 }
    );
  }
}
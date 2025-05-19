import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación para actualización
const updateDispositivoSchema = z.object({
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
    .optional(),
});

// GET: Obtener dispositivo por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }

    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id: BigInt(params.id) },
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
      consumos: dispositivo.consumos.map((consumo) => ({
        ...consumo,
        id: consumo.id.toString(),
      })),
    });

  } catch (error) {
    console.error("Error GET dispositivo:", error);
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
    // Validar ID
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateDispositivoSchema.parse(body);

    const updatedDispositivo = await prisma.dispositivo.update({
      where: { id: BigInt(params.id) },
      data: validatedData,
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    return NextResponse.json({
      ...updatedDispositivo,
      id: updatedDispositivo.id.toString(),
      consumoAparatoSug: updatedDispositivo.consumoAparatoSug.toString(),
      ubicacionId: updatedDispositivo.ubicacionId.toString(),
      grupoId: updatedDispositivo.grupoId?.toString() ?? null,
      listaUbicacion: updatedDispositivo.listaUbicacion ? {
        ...updatedDispositivo.listaUbicacion,
        id: updatedDispositivo.listaUbicacion.id.toString(),
      } : null,
      grupo: updatedDispositivo.grupo ? {
        ...updatedDispositivo.grupo,
        id: updatedDispositivo.grupo.id.toString(),
      } : null,
      consumos: updatedDispositivo.consumos.map((consumo) => ({
        ...consumo,
        id: consumo.id.toString(),
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
    
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === "P2025") {
        return NextResponse.json(
          { error: "Dispositivo no encontrado" },
          { status: 404 }
        );
      }
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
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }

    await prisma.dispositivo.delete({
      where: { id: BigInt(params.id) },
    });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === "P2025") {
        return NextResponse.json(
          { error: "Dispositivo no encontrado" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al eliminar el dispositivo" },
      { status: 500 }
    );
  }
}
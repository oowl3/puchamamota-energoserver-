import { NextResponse, type NextRequest } from "next/server";
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

// Helper para errores de Prisma
const isPrismaError = (error: unknown): error is { code: string } => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

// GET: Obtener dispositivo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }

    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id: BigInt(id) },
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

    return NextResponse.json(transformDispositivo(dispositivo));

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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateDispositivoSchema.parse(body);

    const updatedDispositivo = await prisma.dispositivo.update({
      where: { id: BigInt(id) },
      data: validatedData,
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    return NextResponse.json(transformDispositivo(updatedDispositivo));

  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (isPrismaError(error) && error.code === "P2025") {
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }

    await prisma.dispositivo.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    if (isPrismaError(error) && error.code === "P2025") {
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

// Función helper para transformar el dispositivo
const transformDispositivo = (dispositivo: any) => ({
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
});
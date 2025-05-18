// app/api/dispositivos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const dispositivoSchema = z.object({
  codigoesp: z.string().nullable().optional().default(null),
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
    .default(null),
});

const updateDispositivoSchema = dispositivoSchema.partial();

function convertDispositivo(dispositivo: any) {
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
    const id = BigInt(params.id);

    // Buscar dispositivo
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id },
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

    return NextResponse.json(convertDispositivo(dispositivo));
  } catch (error) {
    console.error("Error GET dispositivo por ID:", error);
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
    const id = BigInt(params.id);

    // Validar cuerpo
    const body = await request.json();
    const validatedData = updateDispositivoSchema.parse(body);

    // Filtrar datos undefined
    const updateData = Object.entries(validatedData).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as any);

    // Actualizar
    const updatedDispositivo = await prisma.dispositivo.update({
      where: { id },
      data: updateData,
      include: {
        listaUbicacion: true,
        grupo: true,
        consumos: true,
      },
    });

    return NextResponse.json(convertDispositivo(updatedDispositivo));
  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
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
    // Validar ID
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "ID debe ser un número entero" },
        { status: 400 }
      );
    }
    const id = BigInt(params.id);

    // Verificar existencia
    const dispositivo = await prisma.dispositivo.findUnique({ where: { id } });
    if (!dispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar
    await prisma.dispositivo.delete({ where: { id } });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    return NextResponse.json(
      { error: "Error al eliminar el dispositivo" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

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

    // Convertir BigInt a strings
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
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    const id = BigInt(params.id);

    // Validar cuerpo
    const body = await request.json();
    const validatedData = dispositivoSchema.parse(body);

    // Actualizar dispositivo
    const updatedDispositivo = await prisma.dispositivo.update({
      where: { id },
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
    
    // Manejar errores de validación
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    // Manejar errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Dispositivo no encontrado" },
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "El código ESP ya existe" },
          { status: 409 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Error en relación con claves foráneas" },
          { status: 400 }
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
    // Validar ID
    if (!/^\d+$/.test(params.id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    const id = BigInt(params.id);

    // Eliminar dispositivo
    await prisma.dispositivo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Dispositivo no encontrado" },
          { status: 404 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "No se puede eliminar debido a registros relacionados" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al eliminar el dispositivo" },
      { status: 500 }
    );
  }
}
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const idSchema = z.object({
  id: z.coerce.bigint({ invalid_type_error: "ID inválido" }).positive("ID debe ser positivo")
});

const grupoHistorialSchema = z.object({
  periodo: z.coerce.number().int().nonnegative().optional(),
  fechaCorte: z.coerce.date().optional(),
  consumo: z.coerce.number().int().nonnegative().optional(),
}).transform(data => ({
  ...data,
  periodo: data.periodo ? BigInt(data.periodo) : undefined,
  consumo: data.consumo ? BigInt(data.consumo) : undefined
}));

// GET: Obtener un registro específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const { id } = idSchema.parse({ id: idString });

    const historial = await prisma.grupoHistorial.findUnique({
      where: { id },
      include: { grupos: true }
    });

    if (!historial) {
      return NextResponse.json(
        { error: "Registro histórico no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...historial,
      id: historial.id.toString(),
      periodo: historial.periodo?.toString(),
      fechaCorte: historial.fechaCorte?.toISOString(),
      consumo: historial.consumo?.toString(),
      grupos: historial.grupos.map(grupo => ({
        ...grupo,
        id: grupo.id.toString(),
      }))
    });

  } catch (error) {
    console.error("Error GET GrupoHistorial por ID:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener el registro histórico" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un registro existente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const { id } = idSchema.parse({ id: idString });
    const body = await request.json();
    
    const validatedData = grupoHistorialSchema.parse(body);

    const actualizado = await prisma.grupoHistorial.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...actualizado,
      id: actualizado.id.toString(),
      periodo: actualizado.periodo?.toString(),
      fechaCorte: actualizado.fechaCorte?.toISOString(),
      consumo: actualizado.consumo?.toString(),
    });

  } catch (error) {
    console.error("Error PUT GrupoHistorial:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Registro histórico no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar el registro" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un registro
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const { id } = idSchema.parse({ id: idString });

    await prisma.grupoHistorial.delete({ where: { id } });

    return NextResponse.json(
      { message: "Registro histórico eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE GrupoHistorial:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500 }
    );
  }
}
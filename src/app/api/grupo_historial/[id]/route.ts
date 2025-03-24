// app/api/grupo-historial/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const grupoHistorialSchema = z.object({
  periodo: z.coerce.number().int().nonnegative().optional(),
  fechaCorte: z.coerce.date().optional(),
  consumo: z.coerce.number().int().nonnegative().optional(),
});

// GET: Obtener un registro específico por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = z.string().min(1).parse(params.id);

    const historial = await prisma.grupoHistorial.findUnique({
      where: { id: BigInt(id) },
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
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: "ID inválido" }, { status: 400 })
      : NextResponse.json(
          { error: "Error al obtener el registro histórico" },
          { status: 500 }
        );
  }
}

// PUT: Actualizar un registro existente
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = z.string().min(1).parse(params.id);
    const body = await request.json();
    const validatedData = grupoHistorialSchema.parse(body);

    // Verificar existencia del registro
    const existeRegistro = await prisma.grupoHistorial.findUnique({
      where: { id: BigInt(id) }
    });

    if (!existeRegistro) {
      return NextResponse.json(
        { error: "Registro histórico no encontrado" },
        { status: 404 }
      );
    }

    const actualizado = await prisma.grupoHistorial.update({
      where: { id: BigInt(id) },
      data: {
        periodo: validatedData.periodo ? BigInt(validatedData.periodo) : undefined,
        fechaCorte: validatedData.fechaCorte,
        consumo: validatedData.consumo ? BigInt(validatedData.consumo) : undefined,
      }
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
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json(
          { error: "Error al actualizar el registro" },
          { status: 500 }
        );
  }
}

// DELETE: Eliminar un registro
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = z.string().min(1).parse(params.id);

    await prisma.grupoHistorial.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { message: "Registro histórico eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE GrupoHistorial:", error);
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: "ID inválido" }, { status: 400 })
      : NextResponse.json(
          { error: "Error al eliminar el registro" },
          { status: 500 }
        );
  }
}
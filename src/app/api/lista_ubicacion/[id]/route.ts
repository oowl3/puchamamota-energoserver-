import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Esquemas de validación
const idSchema = z.object({
  id: z.coerce.number({
    invalid_type_error: "ID debe ser un número válido",
    required_error: "Se requiere el ID"
  }).int().positive("ID debe ser un número positivo")
});

const ubicacionSchema = z.object({
  ubicacion: z.string().min(1, "La ubicación no puede estar vacía")
});

// GET: Obtener ubicación por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const { id } = idSchema.parse({ id: paramId });

    const ubicacion = await prisma.listaUbicacion.findUnique({
      where: { id }
    });

    if (!ubicacion) {
      return NextResponse.json(
        { error: "Ubicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...ubicacion,
      id: ubicacion.id.toString()
    });

  } catch (error) {
    console.error("Error GET ubicación por ID:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener ubicación" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar ubicación
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [{ id: paramId }, body] = await Promise.all([
      params,
      request.json()
    ]);
    
    const { id } = idSchema.parse({ id: paramId });
    const validatedData = ubicacionSchema.parse(body);

    const ubicacionActualizada = await prisma.listaUbicacion.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...ubicacionActualizada,
      id: ubicacionActualizada.id.toString()
    });

  } catch (error) {
    console.error("Error PUT ubicación:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Ubicación no encontrada" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al actualizar ubicación" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar ubicación
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params;
    const { id } = idSchema.parse({ id: paramId });

    await prisma.listaUbicacion.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Ubicación eliminada correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE ubicación:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Ubicación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar ubicación" },
      { status: 500 }
    );
  }
}
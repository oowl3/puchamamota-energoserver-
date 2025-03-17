import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ubicacionSchema = z.object({
  ubicacion: z.string().min(1, "La ubicación no puede estar vacía")
});

type PrismaError = {
  code: string;
  meta?: {
    target?: string[];
  };
};

// GET: Obtener ubicación por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Acceso asincrónico a params
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID debe ser un número válido" },
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { error: "Error al obtener ubicación" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar ubicación
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Acceso asincrónico a params y body
    const [{ id: paramId }, body] = await Promise.all([
      params,
      request.json()
    ]);
    
    const id = parseInt(paramId);
    const validatedData = ubicacionSchema.parse(body);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID debe ser un número válido" },
        { status: 400 }
      );
    }

    const ubicacionActualizada = await prisma.listaUbicacion.update({
      where: { id },
      data: { ubicacion: validatedData.ubicacion }
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
    
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Acceso asincrónico a params
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID debe ser un número válido" },
        { status: 400 }
      );
    }

    await prisma.listaUbicacion.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Ubicación eliminada correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE ubicación:", error);
    
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { error: "Ubicación no encontrada" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al eliminar ubicación" },
      { status: 500 }
    );
  }
}
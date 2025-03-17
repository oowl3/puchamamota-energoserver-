import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquemas de validación
const idParamSchema = z.object({
  id: z.coerce.number().positive("ID debe ser un número positivo")
});

const updateConsejoSchema = z.object({
  informacion: z.string().min(1, "La información no puede estar vacía")
});

// Función auxiliar para manejar parámetros asíncronos
async function handleParams(paramsPromise: Promise<{ id: string }>) {
  const params = await paramsPromise;
  return idParamSchema.parse({ id: params.id });
}

// GET: Obtener un consejo por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Acceso asíncrono a los parámetros
    const { id } = await handleParams(Promise.resolve(params));

    const consejo = await prisma.consejo.findUnique({
      where: { id }
    });

    if (!consejo) {
      return NextResponse.json(
        { error: "Consejo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...consejo,
      id: consejo.id.toString()
    });

  } catch (error) {
    console.error("Error GET consejo por ID:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener el consejo" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un consejo
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Acceso asíncrono a los parámetros
    const { id } = await handleParams(Promise.resolve(params));
    
    // Validar cuerpo
    const body = await request.json();
    const validatedData = updateConsejoSchema.parse(body);

    const consejoActualizado = await prisma.consejo.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...consejoActualizado,
      id: consejoActualizado.id.toString()
    });

  } catch (error) {
    console.error("Error PUT consejo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("P2025")) {
      return NextResponse.json(
        { error: "Consejo no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar el consejo" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un consejo
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Acceso asíncrono a los parámetros
    const { id } = await handleParams(Promise.resolve(params));

    await prisma.consejo.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Consejo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE consejo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("P2025")) {
      return NextResponse.json(
        { error: "Consejo no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar el consejo" },
      { status: 500 }
    );
  }
}
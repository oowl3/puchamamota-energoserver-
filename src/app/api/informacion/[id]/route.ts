import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const informacionSchema = z.object({
  pregunta: z.string().nullable().optional(),
  respuesta: z.string().nullable().optional()
});

// Cabeceras CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET: Obtener información por ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    const informacion = await prisma.informacion.findUnique({
      where: { id },
    });

    if (!informacion) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404, headers: corsHeaders }
      );
    }

    const informacionConvertida = {
      ...informacion,
      id: informacion.id.toString()
    };

    return NextResponse.json(informacionConvertida, { headers: corsHeaders });

  } catch (error) {
    console.error("Error en GET /api/informacion/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT: Actualizar información por ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [resolvedParams, body] = await Promise.all([
      params,
      request.json()
    ]);
    
    const id = Number(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    const validatedData = informacionSchema.parse(body);

    const informacionActualizada = await prisma.informacion.update({
      where: { id },
      data: validatedData,
    });

    const informacionConvertida = {
      ...informacionActualizada,
      id: informacionActualizada.id.toString()
    };

    return NextResponse.json(informacionConvertida, { headers: corsHeaders });

  } catch (error) {
    console.error("Error en PUT /api/informacion/[id]:", error);
    
    const errorMessage = error instanceof z.ZodError 
      ? { error: "Datos inválidos", details: error.errors }
      : { error: "Error al actualizar el registro" };

    return NextResponse.json(
      errorMessage,
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE: Eliminar información por ID
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    await prisma.informacion.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Registro eliminado correctamente" },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error en DELETE /api/informacion/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar el registro" },
      { status: 500, headers: corsHeaders }
    );
  }
}
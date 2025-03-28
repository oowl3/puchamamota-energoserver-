import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Cabeceras CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET: Obtener un idioma por ID
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

    const idioma = await prisma.listaIdioma.findUnique({
      where: { id },
    });

    if (!idioma) {
      return NextResponse.json(
        { error: "Idioma no encontrado" },
        { status: 404, headers: corsHeaders }
      );
    }

    const idiomaConvertido = {
      ...idioma,
      id: idioma.id.toString(),
    };

    return NextResponse.json(idiomaConvertido, { headers: corsHeaders });

  } catch (error) {
    console.error("Error en GET /api/idiomas/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT: Actualizar un idioma por ID
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

    const idiomaActualizado = await prisma.listaIdioma.update({
      where: { id },
      data: body,
    });

    const idiomaConvertido = {
      ...idiomaActualizado,
      id: idiomaActualizado.id.toString(),
    };

    return NextResponse.json(idiomaConvertido, { headers: corsHeaders });

  } catch (error) {
    console.error("Error en PUT /api/idiomas/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar el idioma" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE: Eliminar un idioma por ID
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

    await prisma.listaIdioma.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Idioma eliminado correctamente" },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error en DELETE /api/idiomas/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar el idioma" },
      { status: 500, headers: corsHeaders }
    );
  }
}
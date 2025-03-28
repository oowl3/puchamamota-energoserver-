// src/app/api/tarifas/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ListaTarifa } from "@prisma/client";

// Cabeceras CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Función para convertir BigInt a string
const convertirTarifa = (tarifa: ListaTarifa) => ({
  ...tarifa,
  id: tarifa.id.toString(),
});

// Manejar todas las solicitudes de forma asíncrona
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar los parámetros dinámicos
    const { id: paramId } = await params;
    
    // Validar y convertir ID
    const id = Number(paramId);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    const tarifa = await prisma.listaTarifa.findUnique({
      where: { id },
    });

    if (!tarifa) {
      return NextResponse.json(
        { error: "Tarifa no encontrada" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      convertirTarifa(tarifa),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error en GET /api/tarifas/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar parámetros
    const { id: paramId } = await params;
    const id = Number(paramId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validar cuerpo
    const body = await request.json();
    if (!body.tarifa || body.tarifa.trim().length < 2) {
      return NextResponse.json(
        { error: "La tarifa debe tener al menos 2 caracteres" },
        { status: 400, headers: corsHeaders }
      );
    }

    const tarifaActualizada = await prisma.listaTarifa.update({
      where: { id },
      data: { tarifa: body.tarifa },
    });

    return NextResponse.json(
      convertirTarifa(tarifaActualizada),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error en PUT /api/tarifas/[id]:", error);
    return NextResponse.json(
      { error: "Error al actualizar la tarifa" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Esperar parámetros
    const { id: paramId } = await params;
    const id = Number(paramId);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    await prisma.listaTarifa.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tarifa eliminada correctamente" },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error en DELETE /api/tarifas/[id]:", error);
    return NextResponse.json(
      { error: "Error al eliminar la tarifa" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Manejar solicitudes OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
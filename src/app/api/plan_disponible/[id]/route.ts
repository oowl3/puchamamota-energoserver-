// src/app/api/planes-disponibles/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { PlanDisponible } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const convertirPlan = (plan: PlanDisponible) => ({
  ...plan,
  id: plan.id.toString(),
  duracion: plan.duracion.toString(),
  costo: plan.costo.toString(),
});

// GET: Obtener plan por ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const planId = Number(id);
    
    if (isNaN(planId)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    const plan = await prisma.planDisponible.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan no encontrado" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(convertirPlan(plan), { headers: corsHeaders });

  } catch (error) {
    console.error("Error GET plan:", error);
    return NextResponse.json(
      { error: "Error al obtener plan" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT: Actualizar plan
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const planId = Number(id);
    const body = await request.json();

    if (isNaN(planId)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validaciones
    if (body.nombre && body.nombre.trim().length < 3) {
      return NextResponse.json(
        { error: "Nombre debe tener al menos 3 caracteres" },
        { status: 400, headers: corsHeaders }
      );
    }

    const datosActualizados: any = {};
    if (body.nombre) datosActualizados.nombre = body.nombre;
    if (body.descripcion) datosActualizados.descripcion = body.descripcion;
    if (body.duracion) datosActualizados.duracion = BigInt(body.duracion);
    if (body.costo) datosActualizados.costo = BigInt(body.costo);

    const planActualizado = await prisma.planDisponible.update({
      where: { id: planId },
      data: datosActualizados,
    });

    return NextResponse.json(convertirPlan(planActualizado), { headers: corsHeaders });

  } catch (error) {
    console.error("Error PUT plan:", error);
    return NextResponse.json(
      { error: "Error al actualizar plan" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE: Eliminar plan
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const planId = Number(id);

    if (isNaN(planId)) {
      return NextResponse.json(
        { error: "ID no válido" },
        { status: 400, headers: corsHeaders }
      );
    }

    await prisma.planDisponible.delete({
      where: { id: planId },
    });

    return NextResponse.json(
      { message: "Plan eliminado correctamente" },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error DELETE plan:", error);
    return NextResponse.json(
      { error: "Error al eliminar plan" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
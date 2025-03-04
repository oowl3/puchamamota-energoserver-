// src/app/api/planes-disponibles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

// GET: Obtener todos los planes
export async function GET() {
  try {
    const planes = await prisma.planDisponible.findMany();
    return NextResponse.json(planes.map(convertirPlan), { headers: corsHeaders });
  } catch (error) {
    console.error("Error GET planes:", error);
    return NextResponse.json(
      { error: "Error al obtener planes" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST: Crear nuevo plan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validaciones
    if (!body.nombre || body.nombre.trim().length < 3) {
      return NextResponse.json(
        { error: "Nombre debe tener al menos 3 caracteres" },
        { status: 400, headers: corsHeaders }
      );
    }
    
    if (!body.duracion || isNaN(body.duracion)) {
      return NextResponse.json(
        { error: "Duración no válida" },
        { status: 400, headers: corsHeaders }
      );
    }

    const nuevoPlan = await prisma.planDisponible.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion || "",
        duracion: BigInt(body.duracion),
        costo: BigInt(body.costo || 0),
      },
    });

    return NextResponse.json(convertirPlan(nuevoPlan), { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error("Error POST plan:", error);
    return NextResponse.json(
      { error: "Error al crear plan" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Manejar solicitudes OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
// src/app/api/planes-disponibles/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from "zod";

// Configuración común
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const withCorsHeaders = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  return response;
};

// Esquemas y tipos
const updatePlanSchema = z.object({
  nombre: z.string().min(3).optional(),
  descripcion: z.string().optional(),
  duracion: z.union([z.string(), z.number()]).transform(Number).pipe(z.number().positive()),
  costo: z.union([z.string(), z.number()]).transform(Number).pipe(z.number().positive())
}).partial();

type PlanResponse = {
  id: string;
  [key: string]: any;
};

// Utilidades
const handleApiError = (error: unknown) => {
  console.error(error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json({
      error: "Validación fallida",
      detalles: error.errors.map(e => ({ campo: e.path.join('.'), mensaje: e.message }))
    }, { status: 400 });
  }

  if (error instanceof PrismaClientKnownRequestError) {
    return NextResponse.json(
      { error: error.code === 'P2025' ? "Recurso no encontrado" : "Error de base de datos" },
      { status: error.code === 'P2025' ? 404 : 500 }
    );
  }

  return NextResponse.json(
    { error: "Error interno del servidor" },
    { status: 500 }
  );
};

const convertPlan = (plan: any): PlanResponse => ({
  ...plan,
  id: plan.id.toString(),
  duracion: plan.duracion.toString(),
  costo: plan.costo.toString(),
});

const validatePlanId = (id: string) => {
  const planId = Number(id);
  return isNaN(planId) 
    ? NextResponse.json({ error: "ID inválido" }, { status: 400 })
    : planId;
};

// Handlers
async function handleRequest<T>(
  handler: () => Promise<T>,
  successStatus: number = 200
) {
  try {
    const result = await handler();
    const response = NextResponse.json(result, { status: successStatus });
    return withCorsHeaders(response);
  } catch (error) {
    return withCorsHeaders(handleApiError(error));
  }
}

// Endpoints
export async function GET(_: Request, { params }: { params: { id: string } }) {
  return handleRequest(async () => {
    const planId = validatePlanId(params.id);
    if (planId instanceof NextResponse) return planId;

    const plan = await prisma.planDisponible.findUnique({ where: { id: planId } });
    return plan ? convertPlan(plan) : NextResponse.json(
      { error: "Plan no encontrado" }, 
      { status: 404 }
    );
  });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleRequest(async () => {
    const planId = validatePlanId(params.id);
    if (planId instanceof NextResponse) return planId;

    const data = updatePlanSchema.parse(await request.json());
    const updatedPlan = await prisma.planDisponible.update({
      where: { id: planId },
      data: {
        ...data,
        duracion: data.duracion ? BigInt(data.duracion) : undefined,
        costo: data.costo ? BigInt(data.costo) : undefined
      }
    });
    
    return convertPlan(updatedPlan);
  });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  return handleRequest(async () => {
    const planId = validatePlanId(params.id);
    if (planId instanceof NextResponse) return planId;

    await prisma.planDisponible.delete({ where: { id: planId } });
    return new NextResponse(null, { status: 204 });
  }, 204);
}

export async function OPTIONS() {
  return withCorsHeaders(new NextResponse(null, { status: 204 }));
}
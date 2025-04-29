// src/app/api/configuraciones/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { NextRequest } from "next/server";

const configSchema = z.object({
  periodoFacturacion: z.string().min(1, "Periodo de facturación requerido"),
  consumoAnterior: z.coerce.bigint().nonnegative("Consumo anterior inválido"),
  consumoActual: z.coerce.bigint().nonnegative("Consumo actual inválido"),
  planActualId: z.coerce.bigint({ required_error: "Plan actual requerido" })
});

// GET Todas las configuraciones
export async function GET() {
  try {
    const configuraciones = await prisma.usuarioConfiguracion.findMany({
      include: {
        planDisponible: true,
        usuarios: true,
        configuracionAlertas: true
      },
      orderBy: { id: "desc" }
    });

    return NextResponse.json(configuraciones.map(config => ({
      ...config,
      id: config.id.toString(),
      consumoAnterior: config.consumoAnterior.toString(),
      consumoActual: config.consumoActual.toString(),
      planActualId: config.planActualId.toString(),
      planDisponible: {
        ...config.planDisponible,
        id: config.planDisponible.id.toString()
      },
      usuarios: config.usuarios.map(u => ({
        ...u,
        id: u.id.toString(),
        tarifaId: u.tarifaId.toString()
      })),
      configuracionAlertas: config.configuracionAlertas.map(ca => ({
        ...ca,
        id: ca.id.toString(),
        usuarioConfiguracionId: ca.usuarioConfiguracionId.toString()
      }))
    })));

  } catch (error) {
    console.error("Error GET configuraciones:", error);
    return NextResponse.json(
      { error: "Error obteniendo configuraciones" },
      { status: 500 }
    );
  }
}

// POST Crear nueva configuración
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = configSchema.parse(body);

    const nuevaConfig = await prisma.usuarioConfiguracion.create({
      data: {
        ...validatedData,
        configuracionAlertas: {
          create: [] // Creación de alertas vacías por defecto
        }
      },
      include: {
        planDisponible: true,
        configuracionAlertas: true
      }
    });

    return NextResponse.json({
      ...nuevaConfig,
      id: nuevaConfig.id.toString(),
      consumoAnterior: nuevaConfig.consumoAnterior.toString(),
      consumoActual: nuevaConfig.consumoActual.toString(),
      planActualId: nuevaConfig.planActualId.toString(),
      planDisponible: {
        ...nuevaConfig.planDisponible,
        id: nuevaConfig.planDisponible.id.toString()
      },
      configuracionAlertas: nuevaConfig.configuracionAlertas.map(ca => ({
        ...ca,
        id: ca.id.toString(),
        usuarioConfiguracionId: ca.usuarioConfiguracionId.toString()
      }))
    }, { status: 201 });

  } catch (error) {
    console.error("Error POST configuración:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
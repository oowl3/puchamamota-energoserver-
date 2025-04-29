// src/app/api/configuraciones/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const configSchema = z.object({
  periodoFacturacion: z.string().min(1, "Periodo de facturación requerido"),
  consumoAnterior: z.coerce.bigint().nonnegative("Consumo anterior inválido"),
  consumoActual: z.coerce.bigint().nonnegative("Consumo actual inválido"),
  planActualId: z.coerce.bigint({ required_error: "Plan actual requerido" })
});

// GET Configuración por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = BigInt(idString);
    
    const configuracion = await prisma.usuarioConfiguracion.findUnique({
      where: { id },
      include: {
        planDisponible: true,
        usuarios: true,
        configuracionAlertas: true
      }
    });

    if (!configuracion) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...configuracion,
      id: configuracion.id.toString(),
      consumoAnterior: configuracion.consumoAnterior.toString(),
      consumoActual: configuracion.consumoActual.toString(),
      planActualId: configuracion.planActualId.toString(),
      planDisponible: {
        ...configuracion.planDisponible,
        id: configuracion.planDisponible.id.toString()
      },
      usuarios: configuracion.usuarios.map(u => ({
        ...u,
        id: u.id.toString(),
        tarifaId: u.tarifaId.toString()
      })),
      configuracionAlertas: configuracion.configuracionAlertas.map(ca => ({
        ...ca,
        id: ca.id.toString(),
        // Campo corregido según tu schema
        usuarioConfiguracionId: ca.usuarioConfiguracionId.toString()
      }))
    });

  } catch (error) {
    console.error("Error GET configuración:", error);
    return NextResponse.json(
      { error: "ID inválido o error del servidor" },
      { status: 400 }
    );
  }
}

// POST Crear nueva configuración
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = configSchema.parse(body);

    const nuevaConfiguracion = await prisma.usuarioConfiguracion.create({
      data: validatedData
    });

    return NextResponse.json({
      ...nuevaConfiguracion,
      id: nuevaConfiguracion.id.toString(),
      consumoAnterior: nuevaConfiguracion.consumoAnterior.toString(),
      consumoActual: nuevaConfiguracion.consumoActual.toString(),
      planActualId: nuevaConfiguracion.planActualId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error("Error POST configuración:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Configuración ya existe" },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT Actualizar configuración
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = BigInt(idString);
    const body = await request.json();
    const validatedData = configSchema.parse(body);

    const configActualizada = await prisma.usuarioConfiguracion.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...configActualizada,
      id: configActualizada.id.toString(),
      consumoAnterior: configActualizada.consumoAnterior.toString(),
      consumoActual: configActualizada.consumoActual.toString(),
      planActualId: configActualizada.planActualId.toString()
    });

  } catch (error) {
    console.error("Error PUT configuración:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Configuración no encontrada" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE Eliminar configuración
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = BigInt(idString);
    
    await prisma.usuarioConfiguracion.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Configuración eliminada correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE configuración:", error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Configuración no encontrada" },
          { status: 404 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "No se puede eliminar, existen dependencias relacionadas" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
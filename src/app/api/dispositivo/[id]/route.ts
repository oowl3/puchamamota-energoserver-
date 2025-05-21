// src/app/api/dispositivos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const dispositivoSchema = z.object({
  nombreDispositivo: z.string().min(1, "El nombre del dispositivo es requerido"),
  consumoAparatoSug: z.string().regex(/^\d+$/).transform(BigInt),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  codigoesp: z.string().optional().nullable(),
  grupoId: z.string().regex(/^\d+$/).optional().nullable().transform(val => val ? BigInt(val) : null),
});

// GET dispositivo por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id },
      include: { grupo: true, consumos: true }
    });

    if (!dispositivo) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...dispositivo,
      id: dispositivo.id.toString(),
      consumoAparatoSug: dispositivo.consumoAparatoSug.toString(),
      grupoId: dispositivo.grupoId?.toString() ?? null,
      grupo: dispositivo.grupo ? {
        ...dispositivo.grupo,
        id: dispositivo.grupo.id.toString()
      } : null,
      consumos: dispositivo.consumos.map(c => ({
        ...c,
        id: c.id.toString(),
        codigoesp: c.codigoesp,
        voltaje: c.voltaje.toString(),
        corriente: c.corriente.toString(),
        potencia: c.potencia.toString(),
        energia: c.energia.toString(),
        fechaHora: c.fechaHora.toISOString()
      }))
    });

  } catch (error) {
    console.error("Error GET dispositivo por ID:", error);
    return NextResponse.json(
      { error: "ID inválido o error del servidor" },
      { status: 400 }
    );
  }
}

// PUT actualizar dispositivo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();
    const validatedData = dispositivoSchema.parse(body);

    const dispositivoActualizado = await prisma.dispositivo.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...dispositivoActualizado,
      id: dispositivoActualizado.id.toString(),
      consumoAparatoSug: dispositivoActualizado.consumoAparatoSug.toString(),
      grupoId: dispositivoActualizado.grupoId?.toString() ?? null
    });

  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Dispositivo no encontrado" },
          { status: 404 }
        );
      }
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "El código ESP ya está en uso" },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "El grupo especificado no existe" },
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

// DELETE eliminar dispositivo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = BigInt(params.id);
    
    await prisma.dispositivo.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Dispositivo no encontrado" },
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
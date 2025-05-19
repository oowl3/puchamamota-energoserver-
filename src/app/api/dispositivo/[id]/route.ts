// src/app/api/dispositivos/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { NextRequest } from 'next/server';

const updateSchema = z.object({
  codigoesp: z.string().optional().nullable(),
  nombreDispositivo: z.string().min(3).optional(),
  consumoAparatoSug: z.number().positive().optional(),
  ubicacionId: z.number().positive().optional(),
  listaUbicacion: z.string().min(2).optional(),
  grupoId: z.number().positive().optional().nullable(),
});

// GET por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id: Number(id) },
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
      ubicacionId: dispositivo.ubicacionId.toString(),
      grupoId: dispositivo.grupoId?.toString()
    });

  } catch (error) {
    console.error("Error GET dispositivo:", error);
    return NextResponse.json(
      { error: "Error al obtener dispositivo" },
      { status: 500 }
    );
  }
}

// PUT actualizar dispositivo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validatedData = updateSchema.parse({
      ...body,
      consumoAparatoSug: body.consumoAparatoSug ? Number(body.consumoAparatoSug) : undefined,
      ubicacionId: body.ubicacionId ? Number(body.ubicacionId) : undefined,
      grupoId: body.grupoId ? Number(body.grupoId) : null
    });

    const existente = await prisma.dispositivo.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existente) {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    if (validatedData.codigoesp && validatedData.codigoesp !== existente.codigoesp) {
      const codigoExistente = await prisma.dispositivo.findUnique({
        where: { codigoesp: validatedData.codigoesp }
      });
      
      if (codigoExistente) {
        return NextResponse.json(
          { error: "El código ESP ya está en uso" },
          { status: 400 }
        );
      }
    }

    const actualizado = await prisma.dispositivo.update({
      where: { id: Number(id) },
      data: validatedData
    });

    return NextResponse.json({
      ...actualizado,
      id: actualizado.id.toString(),
      consumoAparatoSug: actualizado.consumoAparatoSug.toString(),
      ubicacionId: actualizado.ubicacionId.toString(),
      grupoId: actualizado.grupoId?.toString()
    });

  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al actualizar dispositivo" }, { status: 500 });
  }
}

// DELETE dispositivo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.dispositivo.delete({
      where: { id: Number(id) }
    });
    
    return NextResponse.json(
      { message: "Dispositivo eliminado correctamente" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    return NextResponse.json(
      { error: "Error al eliminar dispositivo" },
      { status: 500 }
    );
  }
}
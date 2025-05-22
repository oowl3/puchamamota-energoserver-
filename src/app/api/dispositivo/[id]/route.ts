import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const dispositivoUpdateSchema = z.object({
  nombreDispositivo: z.string().min(1).optional(),
  consumoAparatoSug: z.string().regex(/^\d+$/).transform(BigInt).optional(),
  ubicacion: z.string().min(1).optional(),
  codigoesp: z.string().optional().nullable(),
  grupoId: z.string().regex(/^\d+$/).optional().nullable().transform(v => v ? BigInt(v) : null)
});

// GET dispositivo por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const id = z.string().regex(/^\d+$/).parse(params.id);
    
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id: BigInt(id) },
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
        voltaje: c.voltaje.toString(),
        corriente: c.corriente.toString(),
        potencia: c.potencia.toString(),
        energia: c.energia.toString(),
        fechaHora: c.fechaHora.toISOString()
      }))
    });

  } catch (error) {
    console.error("Error GET dispositivo por ID:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT Actualizar dispositivo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const id = z.string().regex(/^\d+$/).parse(params.id);
    
    const body = await request.json();
    const validatedData = dispositivoUpdateSchema.parse(body);

    const dispositivoActualizado = await prisma.dispositivo.update({
      where: { id: BigInt(id) },
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
          { error: "Código ESP ya existe" },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "Grupo no existe" },
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

// DELETE Eliminar dispositivo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = z.string().regex(/^\d+$/).parse(params.id);

    await prisma.dispositivo.delete({
      where: { id: BigInt(id) }
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
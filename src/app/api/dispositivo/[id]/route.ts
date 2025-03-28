import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización (puede ser diferente al de creación)
const updateDispositivoSchema = z.object({
  codigoEspUsuario: z.number().int().positive().optional(),
  nombreDispositivo: z.string().min(1).optional(),
  nombreAparato: z.string().min(1).optional(),
  consumoAparatoSug: z.number().int().positive().optional(),
  ubicacionId: z.number().int().positive().optional(),
  grupoId: z.number().int().positive().optional().nullable()
});

// GET: Obtener dispositivo por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const dispositivo = await prisma.dispositivo.findUnique({
      where: { id: BigInt(params.id) },
      include: {
        listaUbicacion: true,
        grupo: true
      }
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
      codigoEspUsuario: dispositivo.codigoEspUsuario.toString(),
      consumoAparatoSug: dispositivo.consumoAparatoSug.toString(),
      ubicacionId: dispositivo.ubicacionId.toString(),
      grupoId: dispositivo.grupoId?.toString()
    });

  } catch (error) {
    console.error("Error GET dispositivo por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener dispositivo" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar dispositivo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateDispositivoSchema.parse(body);

    const dispositivoActualizado = await prisma.dispositivo.update({
      where: { id: BigInt(params.id) },
      data: {
        ...validatedData,
        grupoId: validatedData.grupoId === null ? null : validatedData.grupoId
      },
      include: {
        listaUbicacion: true,
        grupo: true
      }
    });

    return NextResponse.json({
      ...dispositivoActualizado,
      id: dispositivoActualizado.id.toString(),
      codigoEspUsuario: dispositivoActualizado.codigoEspUsuario.toString(),
      consumoAparatoSug: dispositivoActualizado.consumoAparatoSug.toString(),
      ubicacionId: dispositivoActualizado.ubicacionId.toString(),
      grupoId: dispositivoActualizado.grupoId?.toString()
    });

  } catch (error) {
    console.error("Error PUT dispositivo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar dispositivo" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar dispositivo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.dispositivo.delete({
      where: { id: BigInt(params.id) }
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error("Error DELETE dispositivo:", error);
    
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: "Dispositivo no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar dispositivo" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación para PUT
const listaAparatoSchema = z.object({
  aparato: z.string().min(3, "El aparato debe tener al menos 3 caracteres"),
});

// GET: Obtener un aparato por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // Validar que el ID sea un número válido
    if (!Number(id)) {
      return NextResponse.json(
        { error: "ID de aparato inválido" },
        { status: 400 }
      );
    }

    const aparato = await prisma.listaAparato.findUnique({
      where: { id: BigInt(id) },
      include: { dispositivosAparatos: true }
    });

    if (!aparato) {
      return NextResponse.json(
        { error: "Aparato no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...aparato,
      id: aparato.id.toString(),
      dispositivosAparatos: aparato.dispositivosAparatos.map(da => ({
        ...da,
        id: da.id.toString(),
      }))
    });

  } catch (error) {
    console.error("Error GET aparato:", error);
    return NextResponse.json(
      { error: "Error al obtener el aparato" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un aparato
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    const validatedData = listaAparatoSchema.parse(body);

    // Verificar existencia del aparato
    const existeAparato = await prisma.listaAparato.findUnique({
      where: { id: BigInt(id) }
    });

    if (!existeAparato) {
      return NextResponse.json(
        { error: "Aparato no encontrado" },
        { status: 404 }
      );
    }

    const aparatoActualizado = await prisma.listaAparato.update({
      where: { id: BigInt(id) },
      data: {
        aparato: validatedData.aparato
      }
    });

    return NextResponse.json({
      ...aparatoActualizado,
      id: aparatoActualizado.id.toString()
    });

  } catch (error) {
    console.error("Error PUT aparato:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al actualizar el aparato" }, { status: 500 });
  }
}

// DELETE: Eliminar un aparato
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Verificar existencia del aparato
    const existeAparato = await prisma.listaAparato.findUnique({
      where: { id: BigInt(id) }
    });

    if (!existeAparato) {
      return NextResponse.json(
        { error: "Aparato no encontrado" },
        { status: 404 }
      );
    }

    await prisma.listaAparato.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { message: "Aparato eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE aparato:", error);
    return NextResponse.json(
      { error: "Error al eliminar el aparato" },
      { status: 500 }
    );
  }
}
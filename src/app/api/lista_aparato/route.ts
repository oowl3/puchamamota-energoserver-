import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación para POST
const listaAparatoSchema = z.object({
  aparato: z.string().min(3, "El aparato debe tener al menos 3 caracteres"),
});

// GET: Obtener todos los aparatos
export async function GET() {
  try {
    const listaAparatos = await prisma.listaAparato.findMany({
      include: { dispositivosAparatos: true }
    });

    return NextResponse.json(
      listaAparatos.map(aparato => ({
        ...aparato,
        id: aparato.id.toString(),
        dispositivosAparatos: aparato.dispositivosAparatos.map(da => ({
          ...da,
          id: da.id.toString(),
          // Si hay otros campos BigInt en DispositivoAparato, convertir aquí
        }))
      }))
    );

  } catch (error) {
    console.error("Error GET lista aparatos:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de aparatos" },
      { status: 500 }
    );
  }
}

// POST: Crear nuevo aparato
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = listaAparatoSchema.parse(body);

    const nuevoAparato = await prisma.listaAparato.create({
      data: {
        aparato: validatedData.aparato
      }
    });

    return NextResponse.json(
      {
        ...nuevoAparato,
        id: nuevoAparato.id.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST aparato:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear el aparato" }, { status: 500 });
  }
}
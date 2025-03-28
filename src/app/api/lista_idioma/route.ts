import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const idiomaSchema = z.object({
  idioma: z.string().min(2, "El idioma debe tener al menos 2 caracteres")
});
// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = idiomaSchema.parse(body);

    const nuevoIdioma = await prisma.listaIdioma.create({
      data: validatedData
    });


    const responseData = {
      ...nuevoIdioma,
      id: nuevoIdioma.id.toString()
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);

  }
}

// GET
export async function GET() {
  try {
    const idiomas = await prisma.listaIdioma.findMany();

    const idiomasConvertidos = idiomas.map((idioma) => ({
      ...idioma,
      id: idioma.id.toString() 
    }));

    return NextResponse.json(idiomasConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);

  }
}
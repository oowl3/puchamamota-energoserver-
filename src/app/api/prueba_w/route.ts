import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const pruebaWSchema = z.object({
  codigoesp: z.string().transform(val => BigInt(val)),
  voltaje: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "voltaje must be a valid decimal number",
  }),
  corriente: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "corriente must be a valid decimal number",
  }),
  potencia: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "potencia must be a valid decimal number",
  }),
  energia: z.string().refine(val => !isNaN(parseFloat(val)), {
    message: "energia must be a valid decimal number",
  }),
});

// POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = pruebaWSchema.parse(body);

    const nuevaPruebaW = await prisma.prueba_w.create({
      data: {
        codigoesp: validatedData.codigoesp,
        voltaje: validatedData.voltaje,
        corriente: validatedData.corriente,
        potencia: validatedData.potencia,
        energia: validatedData.energia,
      }
    });

    const responseData = {
      ...nuevaPruebaW,
      id: nuevaPruebaW.id.toString(),
      codigoesp: nuevaPruebaW.codigoesp.toString()
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET
export async function GET() {
  try {
    const pruebas = await prisma.prueba_w.findMany();

    const pruebasConvertidas = pruebas.map((prueba) => ({
      ...prueba,
      id: prueba.id.toString(),
      codigoesp: prueba.codigoesp.toString()
    }));

    return NextResponse.json(pruebasConvertidas);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// src/app/api/prueba_w/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  voltaje: z.preprocess(val => Number(val), z.number()),
  corriente: z.preprocess(val => Number(val), z.number()),
  potencia: z.preprocess(val => Number(val), z.number()),
  energia: z.preprocess(val => Number(val), z.number())
});


// GET todos los registros
export async function GET() {
  try {
    const registros = await prisma.prueba_w.findMany();
    
    return NextResponse.json(
      registros.map(r => ({
        ...r,
        id: r.id.toString(),
        voltaje: r.voltaje.toString(),
        corriente: r.corriente.toString(),
        potencia: r.potencia.toString(),
        energia: r.energia.toString()
      }))
    );
    
  } catch (error) {
    console.error("Error GET prueba_w:", error);
    return NextResponse.json(
      { error: "Error al obtener registros" },
      { status: 500 }
    );
  }
}

// POST nuevo registro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createSchema.parse(body);
    
    const nuevoRegistro = await prisma.prueba_w.create({
      data: {
        codigo: validatedData.codigo,
        voltaje: validatedData.voltaje,
        corriente: validatedData.corriente,
        potencia: validatedData.potencia,
        energia: validatedData.energia
      }
    });

    return NextResponse.json(
      {
        ...nuevoRegistro,
        id: nuevoRegistro.id.toString(),
        voltaje: nuevoRegistro.voltaje.toString(),
        corriente: nuevoRegistro.corriente.toString(),
        potencia: nuevoRegistro.potencia.toString(),
        energia: nuevoRegistro.energia.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST prueba_w:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear registro" }, { status: 500 });
  }
}
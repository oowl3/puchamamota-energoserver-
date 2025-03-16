// src/app/api/pruebaw/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

const pruebaSchema = z.object({
  voltaje: z.union([z.number(), z.string()]).refine(value => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, "Debe ser un número decimal válido"),
  corriente: z.union([z.number(), z.string()]).refine(value => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, "Debe ser un número decimal válido"),
  potencia: z.union([z.number(), z.string()]).refine(value => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, "Debe ser un número decimal válido"),
  energia: z.union([z.number(), z.string()]).refine(value => {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }, "Debe ser un número decimal válido"),
});

// GET todos los registros
export async function GET() {
  try {
    const registros = await prisma.prueba_w.findMany();
    
    return NextResponse.json(
      registros.map(registro => ({
        ...registro,
        id: registro.id.toString(),
        voltaje: registro.voltaje.toString(),
        corriente: registro.corriente.toString(),
        potencia: registro.potencia.toString(),
        energia: registro.energia.toString(),
      }))
    );

  } catch (error) {
    console.error("Error GET prueba_w:", error);
    return NextResponse.json(
      { error: "Error al obtener registros de prueba_w" },
      { status: 500 }
    );
  }
}

// POST nuevo registro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = pruebaSchema.parse(body);
    
    const nuevoRegistro = await prisma.prueba_w.create({
      data: {
        voltaje: new Decimal(validatedData.voltaje.toString()),
        corriente: new Decimal(validatedData.corriente.toString()),
        potencia: new Decimal(validatedData.potencia.toString()),
        energia: new Decimal(validatedData.energia.toString()),
      }
    });

    return NextResponse.json(
      {
        ...nuevoRegistro,
        id: nuevoRegistro.id.toString(),
        voltaje: nuevoRegistro.voltaje.toString(),
        corriente: nuevoRegistro.corriente.toString(),
        potencia: nuevoRegistro.potencia.toString(),
        energia: nuevoRegistro.energia.toString(),
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
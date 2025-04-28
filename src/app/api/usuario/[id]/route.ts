// app/api/usuarios/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema actualizado con tarifaId
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  apellido: z.string().nullish(),
  edad: z.string()
    .regex(/^\d+$/, "La edad debe ser un número entero positivo")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  genero: z.string().nullish(),
  telefono: z.string().nullish(),
  tarifaId: z.string()  // Nuevo campo requerido
    .regex(/^\d+$/, "ID de tarifa inválido")
    .transform(val => BigInt(val)),
  configuracionId: z.string()
    .regex(/^\d+$/, "ID de configuración inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  rolId: z.string()
    .regex(/^\d+$/, "ID de rol inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable()
});

// Función recursiva para convertir BigInt
const convertirBigInt = (obj: any): any => {
  if (typeof obj === 'bigint') return obj.toString();
  if (obj instanceof Object) {
    for (const key in obj) {
      obj[key] = convertirBigInt(obj[key]);
    }
  }
  return obj;
};

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } // Corregido: sin Promise
) {
  try {
    const idBigInt = BigInt(params.id);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: idBigInt },
      include: {  // Incluir relaciones
        configuracion: true,
        rol: true,
        grupos: true,
        listaTarifa: true
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Convertir todos los BigInt incluyendo relaciones
    const usuarioConvertido = convertirBigInt(usuario);

    return NextResponse.json(usuarioConvertido);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "ID inválido o error al obtener el usuario" },
      { status: 400 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // Corregido: sin Promise
) {
  try {
    const idBigInt = BigInt(params.id);
    
    const body = await request.json();
    const validatedData = usuarioSchema.partial().parse(body); // Campos opcionales

    if (Object.keys(validatedData).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: idBigInt },
      data: validatedData,
      include: {  // Incluir relaciones actualizadas
        configuracion: true,
        rol: true,
        grupos: true,
        listaTarifa: true
      }
    });

    // Convertir todos los BigInt
    const responseData = convertirBigInt(usuarioActualizado);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // Corregido: sin Promise
) {
  try {
    const idBigInt = BigInt(params.id);
    
    const usuarioEliminado = await prisma.usuario.delete({
      where: { id: idBigInt },
      include: {  // Incluir relaciones para última respuesta
        configuracion: true,
        rol: true,
        grupos: true,
        listaTarifa: true
      }
    });

    // Convertir todos los BigInt
    const responseData = convertirBigInt(usuarioEliminado);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}
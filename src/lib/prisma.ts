import { PrismaClient } from '@prisma/client';

// 1. Primero definimos el tipo del cliente extendido
type ExtendedPrismaClient = ReturnType<typeof getExtendedPrismaClient>;

// 2. Función que crea el cliente extendido
function getExtendedPrismaClient() {
  return new PrismaClient().$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const result = await query(args);
        return convertBigIntToString(result);
      },
    },
  });
}

// 3. Función recursiva para convertir BigInt
function convertBigIntToString(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      newObj[key] = convertBigIntToString(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// 4. Creamos la instancia
const prisma: ExtendedPrismaClient = getExtendedPrismaClient();

// 5. Declaración global ajustada
declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

// Configuración para desarrollo
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined; 
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.model === 'Usuario') {
    if (result?.id) result.id = result.id.toString();
    if (result?.configuracionId) result.configuracionId = result.configuracionId.toString();
    if (result?.rolId) result.rolId = result.rolId.toString();
  }
  return result;
});

export default prisma;



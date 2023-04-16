import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

const client =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['query'],
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

export default client;

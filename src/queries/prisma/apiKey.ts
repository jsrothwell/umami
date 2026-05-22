import prisma from '@/lib/prisma';

export async function getApiKeys(userId: string) {
  return prisma.client.apiKey.findMany({
    where: { userId, revokedAt: null },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getApiKeyByHash(keyHash: string) {
  return prisma.client.apiKey.findUnique({
    where: { keyHash, revokedAt: null },
    select: {
      id: true,
      userId: true,
      revokedAt: true,
    },
  });
}

export async function createApiKey(data: {
  id: string;
  userId: string;
  name: string;
  keyHash: string;
  keyPrefix: string;
}) {
  return prisma.client.apiKey.create({
    data,
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      createdAt: true,
    },
  });
}

export async function revokeApiKey(keyId: string, userId: string) {
  return prisma.client.apiKey.updateMany({
    where: { id: keyId, userId },
    data: { revokedAt: new Date() },
  });
}

import crypto from 'node:crypto';
import { z } from 'zod';
import { parseRequest } from '@/lib/request';
import { json } from '@/lib/response';
import { uuid } from '@/lib/crypto';
import { createApiKey, getApiKeys } from '@/queries/prisma/apiKey';

export async function GET(request: Request) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const keys = await getApiKeys(auth.user.id);

  return json(keys);
}

export async function POST(request: Request) {
  const schema = z.object({
    name: z.string().min(1).max(100),
  });

  const { auth, body, error } = await parseRequest(request, schema);

  if (error) {
    return error();
  }

  const rawKey = `umami_${crypto.randomBytes(32).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  const keyPrefix = rawKey.slice(0, 14);

  const apiKey = await createApiKey({
    id: uuid(),
    userId: auth.user.id,
    name: body.name,
    keyHash,
    keyPrefix,
  });

  return json({ ...apiKey, key: rawKey });
}

import { parseRequest } from '@/lib/request';
import { json, notFound } from '@/lib/response';
import { revokeApiKey } from '@/queries/prisma/apiKey';

export async function DELETE(request: Request, { params }: { params: Promise<{ keyId: string }> }) {
  const { auth, error } = await parseRequest(request);

  if (error) {
    return error();
  }

  const { keyId } = await params;

  const result = await revokeApiKey(keyId, auth.user.id);

  if (result.count === 0) {
    return notFound();
  }

  return json({ ok: true });
}

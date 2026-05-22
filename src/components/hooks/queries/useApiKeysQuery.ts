import { useApi } from '../useApi';
import { useModified } from '../useModified';

export function useApiKeysQuery() {
  const { get, useQuery } = useApi();
  const { modified } = useModified('api-keys');

  return useQuery({
    queryKey: ['api-keys', { modified }],
    queryFn: () => get('/me/api-keys'),
  });
}

export function useCreateApiKeyQuery() {
  const { post, useMutation } = useApi();
  const { touch } = useModified();

  const query = useMutation({
    mutationFn: (data: { name: string }) => post('/me/api-keys', data),
  });

  return { ...query, touch };
}

export function useRevokeApiKeyQuery(keyId: string) {
  const { del, useMutation } = useApi();
  const { touch } = useModified();

  const query = useMutation({
    mutationFn: () => del(`/me/api-keys/${keyId}`),
  });

  return { ...query, touch };
}

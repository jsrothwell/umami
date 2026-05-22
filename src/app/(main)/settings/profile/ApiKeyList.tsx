'use client';
import { Button, Column, Icon, Row, Text } from '@umami/react-zen';
import { Empty } from '@/components/common/Empty';
import { useApiKeysQuery, useRevokeApiKeyQuery } from '@/components/hooks';
import { Trash2 } from '@/components/icons';
import { touch } from '@/components/hooks/useModified';

function ApiKeyRow({
  id,
  name,
  keyPrefix,
  createdAt,
}: {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
}) {
  const { mutateAsync, isPending } = useRevokeApiKeyQuery(id);

  const handleRevoke = async () => {
    await mutateAsync(undefined);
    touch('api-keys');
  };

  return (
    <Row justifyContent="space-between" alignItems="center" gap="4">
      <Column gap="1">
        <Text weight="bold">{name}</Text>
        <Text size="sm" color="muted">
          {keyPrefix}… · Created {new Date(createdAt).toLocaleDateString()}
        </Text>
      </Column>
      <Button variant="quiet" isDisabled={isPending} onPress={handleRevoke} aria-label="Revoke">
        <Icon size="sm">
          <Trash2 />
        </Icon>
      </Button>
    </Row>
  );
}

export function ApiKeyList() {
  const { data: keys, isLoading } = useApiKeysQuery();

  if (isLoading) {
    return null;
  }

  if (!keys?.length) {
    return <Empty message="No API keys. Generate one to get started." />;
  }

  return (
    <Column gap="3">
      {keys.map((key: any) => (
        <ApiKeyRow key={key.id} {...key} />
      ))}
    </Column>
  );
}

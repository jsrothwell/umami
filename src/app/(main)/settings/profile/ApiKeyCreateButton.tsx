'use client';
import {
  Button,
  Column,
  Dialog,
  DialogTrigger,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  Icon,
  Modal,
  Text,
  TextField,
  useToast,
} from '@umami/react-zen';
import { useState } from 'react';
import { CopyButton } from '@/components/common/CopyButton';
import { useCreateApiKeyQuery } from '@/components/hooks';
import { Plus } from '@/components/icons';
import { touch } from '@/components/hooks/useModified';

export function ApiKeyCreateButton() {
  const { mutateAsync, isPending } = useCreateApiKeyQuery();
  const [newKey, setNewKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: { name: string }) => {
    const result = await mutateAsync(data);
    setNewKey(result.key);
    touch('api-keys');
  };

  const handleClose = () => {
    setNewKey(null);
  };

  return (
    <DialogTrigger>
      <Button>
        <Icon>
          <Plus />
        </Icon>
        <Text>Generate API key</Text>
      </Button>
      <Modal>
        <Dialog title="Generate API key" onClose={handleClose} style={{ width: 480 }}>
          {({ close }) =>
            newKey ? (
              <Column gap="4">
                <Text>
                  Copy this key now — it will not be shown again.
                </Text>
                <Column gap="2">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'var(--color-surface-raised)',
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontFamily: 'monospace',
                      fontSize: 13,
                      wordBreak: 'break-all',
                    }}
                  >
                    <span style={{ flex: 1 }}>{newKey}</span>
                    <CopyButton value={newKey} label="Copy API key" />
                  </div>
                </Column>
                <FormButtons>
                  <Button
                    onPress={() => {
                      handleClose();
                      close();
                      toast('API key created');
                    }}
                  >
                    Done
                  </Button>
                </FormButtons>
              </Column>
            ) : (
              <Form onSubmit={handleSubmit}>
                <FormField label="Name" name="name" rules={{ required: 'Required' }}>
                  <TextField placeholder="e.g. appstorecat integration" />
                </FormField>
                <FormButtons>
                  <Button onPress={close}>Cancel</Button>
                  <FormSubmitButton isDisabled={isPending}>Generate</FormSubmitButton>
                </FormButtons>
              </Form>
            )
          }
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

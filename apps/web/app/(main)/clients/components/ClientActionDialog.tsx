import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FC, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { CreateClientDto, createClientSchema } from '@/validation/client';
import { useClient } from '@/hooks/use-client';
import { ClientResponse } from '@/types/client';
import { useI18n } from '@/lib/i18n';

interface ClientActionDialogProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  client: ClientResponse | null;
}

const ClientDialogForm: FC<ClientActionDialogProps> = ({
  client,
  onOpenChange,
}) => {
  const { createClient, updateClient } = useClient({ id: client?.id });
  const { t } = useI18n();

  const defaultValues: CreateClientDto = useMemo(
    () => ({
      firstName: client?.firstName || '',
      middleName: client?.middleName || undefined,
      lastName: client?.lastName || '',
      phoneNumber: client?.phoneNumber || undefined,
    }),
    [client?.id],
  );

  const form = useForm<CreateClientDto>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => form.reset({ ...defaultValues }), [defaultValues]);

  const onSubmit = (data: CreateClientDto) => {
    if (client?.id) {
      updateClient({ ...data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createClient({ ...data }, { onSuccess: () => onOpenChange(false) });
    }
  };

  const onCancel = () => {
    form.reset({ ...defaultValues });
    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.firstName', 'First Name')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('form.firstName', 'First name')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.lastName', 'Last Name')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('form.lastName', 'Last name')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="middleName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.middleName', 'Middle Name')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('form.middleName', 'Middle name')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phoneNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.phoneNumber', 'Phone Number')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('form.phoneNumber', 'Phone number')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('button.cancel', 'Cancel')}
          </Button>
          <Button type="submit">{t('button.save', 'Save')}</Button>
        </div>
      </form>
    </Form>
  );
};

export const ClientActionDialog: FC<ClientActionDialogProps> = ({
  ...props
}) => {
  const { t } = useI18n();

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogTitle>
          {props.client
            ? t('dialog.editClient', 'Edit Client')
            : t('dialog.addClient', 'Add Client')}
        </DialogTitle>
        <ClientDialogForm {...props} />
      </DialogContent>
    </Dialog>
  );
};

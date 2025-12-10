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
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="First name" />
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
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Last name" />
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
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Middle name" />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export const ClientActionDialog: FC<ClientActionDialogProps> = ({
  ...props
}) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogTitle>{props.client ? 'Edit Client' : 'Add Client'}</DialogTitle>
        <ClientDialogForm {...props} />
      </DialogContent>
    </Dialog>
  );
};

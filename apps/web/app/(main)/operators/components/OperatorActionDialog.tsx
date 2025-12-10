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
import { useUser } from '@/hooks/use-user';
import { UserResponse } from '@/types/user';
import { CreateUserDto, createUserSchema } from '@/validation/user';
import { useI18n } from '@/lib/i18n';

interface OperatorActionDialogProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  operator: UserResponse | null;
}

const OperatorDialogForm: FC<OperatorActionDialogProps> = ({
  operator,
  onOpenChange,
}) => {
  const { createOperator, updateOperator } = useUser({ id: operator?.id });
  const { t } = useI18n();

  const defaultValues: CreateUserDto = useMemo(
    () => ({
      firstName: operator?.firstName || '',
      middleName: operator?.middleName || undefined,
      lastName: operator?.lastName || '',
      phoneNumber: operator?.phoneNumber || undefined,
      email: operator?.email || '',
    }),
    [operator?.id],
  );

  const form = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => form.reset({ ...defaultValues }), [defaultValues]);

  const onSubmit = (data: CreateUserDto) => {
    if (operator?.id) {
      updateOperator({ ...data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createOperator({ ...data }, { onSuccess: () => onOpenChange(false) });
    }
  };

  const onCancel = () => {
    form.reset({ ...defaultValues });
    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.firstName', 'First name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.firstNamePlaceholder', 'John')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.middleName', 'Middle name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.middleNamePlaceholder', 'Johnson')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.lastName', 'Last name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.lastNamePlaceholder', 'Doe')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="phoneNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.phoneNumber', 'Phone')}</FormLabel>
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

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.email', 'Email')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('form.email', 'Email')} />
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

export const OpearatorActionDialog: FC<OperatorActionDialogProps> = ({
  ...props
}) => {
  const { t } = useI18n();
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogTitle>
          {props.operator
            ? t('dialog.editOperator', 'Edit Operator')
            : t('dialog.addOperator', 'Add Operator')}
        </DialogTitle>
        <OperatorDialogForm {...props} />
      </DialogContent>
    </Dialog>
  );
};

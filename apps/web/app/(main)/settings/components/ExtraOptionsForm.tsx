import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useExtraOption } from '@/hooks/use-extra-option';
import { useI18n } from '@/lib/i18n';
import {
  CreateExtraOptionDto,
  createExtraOptionSchema,
} from '@/validation/ride';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export const ExtraOptionsForm = () => {
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);

  const {
    extraOptions,
    createExtraOption,
    updateExtraOption,
    deleteExtraOption,
  } = useExtraOption({ id: editingExtraId || undefined });

  const defaultValues = useMemo(
    () => ({
      name: '',
    }),
    [],
  );

  const form = useForm<CreateExtraOptionDto>({
    resolver: zodResolver(createExtraOptionSchema),
    defaultValues: { ...defaultValues },
  });
  const { t } = useI18n();

  const onSubmit = (data: CreateExtraOptionDto) => {
    if (editingExtraId) {
      updateExtraOption(
        { ...data },
        { onSuccess: () => setEditingExtraId(null) },
      );
    } else {
      createExtraOption(
        { ...data },
        { onSuccess: () => form.reset({ ...defaultValues }) },
      );
    }
  };

  useEffect(() => {
    if (!editingExtraId || !extraOptions) {
      form.reset({ ...defaultValues });
      return;
    }
    form.reset({
      name: extraOptions?.data.find((option) => option.id === editingExtraId)
        ?.name,
    });
  }, [editingExtraId]);

  function startEditExtra(id: string) {
    setEditingExtraId(id);
  }

  return (
    <section className="w-full rounded-md bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-medium">
        {t('settings.extraOptions.title', 'Ride Extra Options')}
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-4 flex items-end gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t('settings.extraOptions.name', 'Name')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t(
                      'settings.extraOptions.placeholder',
                      'Extra option name',
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {editingExtraId ? (
            <>
              <Button type="submit" className="h-9">
                {t('button.save', 'Save')}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="h-9"
                onClick={() => {
                  setEditingExtraId(null);
                }}
              >
                {t('button.cancel', 'Cancel')}
              </Button>
            </>
          ) : (
            <Button type="submit" className="h-9">
              {t('button.add', 'Add')}
            </Button>
          )}
        </form>
      </Form>

      <div className="space-y-2">
        {extraOptions?.data.map((option) => (
          <li
            key={option.id}
            className="flex items-center justify-between rounded-lg border p-2"
          >
            <div>{option.name}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEditExtra(option.id)}
              >
                {t('button.edit', 'Edit')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600"
                onClick={() => deleteExtraOption(option.id)}
              >
                {t('button.delete', 'Delete')}
              </Button>
            </div>
          </li>
        ))}
      </div>
    </section>
  );
};

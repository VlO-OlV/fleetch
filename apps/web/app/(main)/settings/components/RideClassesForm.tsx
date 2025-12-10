import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRideClass } from '@/hooks/use-ride-class';
import { useI18n } from '@/lib/i18n';
import { CreateRideClassDto, createRideClassSchema } from '@/validation/ride';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export const RideClassesForm = () => {
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  const { rideClasses, createRideClass, updateRideClass, deleteRideClass } =
    useRideClass({ id: editingClassId || undefined });

  const defaultValues = useMemo(
    () => ({
      name: '',
      priceCoefficient: 1,
    }),
    [],
  );

  const form = useForm<CreateRideClassDto>({
    resolver: zodResolver(createRideClassSchema),
    defaultValues: { ...defaultValues },
  });
  const { t } = useI18n();

  const onSubmit = (data: CreateRideClassDto) => {
    if (editingClassId) {
      updateRideClass(
        { ...data },
        { onSuccess: () => setEditingClassId(null) },
      );
    } else {
      createRideClass(
        { ...data },
        { onSuccess: () => form.reset({ ...defaultValues }) },
      );
    }
  };

  useEffect(() => {
    if (!editingClassId || !rideClasses) {
      form.reset({ ...defaultValues });
      return;
    }
    const rideClass = rideClasses?.data.find(
      (rideClass) => rideClass.id === editingClassId,
    );
    form.reset({
      name: rideClass?.name,
      priceCoefficient: rideClass?.priceCoefficient,
    });
  }, [editingClassId]);

  function startEditClass(id: string) {
    setEditingClassId(id);
  }

  return (
    <section className="w-full rounded-md bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-medium">
        {t('settings.rideClasses.title', 'Ride Classes')}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-4 grid grid-cols-2 gap-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t('settings.rideClasses.className', 'Class name')}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t(
                      'settings.rideClasses.classNamePlaceholder',
                      'Class name',
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceCoefficient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    'settings.rideClasses.priceCoefficient',
                    'Price coefficient',
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step={0.1}
                    min={1}
                    max={5}
                    placeholder={t(
                      'settings.rideClasses.priceCoefficientPlaceholder',
                      'Price coefficient',
                    )}
                    value={field.value}
                    onChange={(e) => {
                      const value = +e.target.value;
                      form.setValue(
                        'priceCoefficient',
                        Math.min(Math.max(value, 1), 5),
                      );
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="col-span-2 flex gap-2">
            {editingClassId ? (
              <>
                <Button type="submit" className="flex-1">
                  {t('button.save', 'Save')}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    setEditingClassId(null);
                  }}
                >
                  {t('button.cancel', 'Cancel')}
                </Button>
              </>
            ) : (
              <Button type="submit" className="w-full">
                {t('settings.rideClasses.addClass', 'Add class')}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-2">
        {rideClasses?.data.map((rideClass) => (
          <li
            key={rideClass.id}
            className="flex items-center justify-between rounded-lg border p-2"
          >
            <div>
              <div className="font-medium">{rideClass.name}</div>
              <div className="text-sm text-muted-foreground">
                {t('settings.rideClasses.coefficientLabel', 'Coefficient:')}{' '}
                {rideClass.priceCoefficient}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEditClass(rideClass.id)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600"
                onClick={() => deleteRideClass(rideClass.id)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </div>
    </section>
  );
};

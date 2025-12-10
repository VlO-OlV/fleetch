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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { CreateDriverDto, createDriverSchema } from '@/validation/driver';
import { DriverResponse } from '@/types/driver';
import { FC, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useDriver } from '@/hooks/use-driver';
import { useRideClass } from '@/hooks/use-ride-class';

interface DriverActionDialogProps {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  driver: DriverResponse | null;
}

const DriverDialogForm: FC<DriverActionDialogProps> = ({
  driver,
  onOpenChange,
}) => {
  const { createDriver, updateDriver } = useDriver({ id: driver?.id });
  const { rideClasses } = useRideClass({});

  const defaultValues: CreateDriverDto = useMemo(
    () => ({
      firstName: driver?.firstName || '',
      middleName: driver?.middleName || undefined,
      lastName: driver?.lastName || '',
      carNumber: driver?.carNumber || '',
      rideClassId: driver?.rideClassId || '',
      phoneNumber: driver?.phoneNumber || undefined,
    }),
    [driver?.id],
  );

  const form = useForm<CreateDriverDto>({
    resolver: zodResolver(createDriverSchema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => form.reset({ ...defaultValues }), [defaultValues]);

  const onSubmit = (data: CreateDriverDto) => {
    if (driver?.id) {
      updateDriver({ ...data }, { onSuccess: () => onOpenChange(false) });
    } else {
      createDriver({ ...data }, { onSuccess: () => onOpenChange(false) });
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
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                <FormLabel>Middle name</FormLabel>
                <FormControl>
                  <Input placeholder="Johnson" {...field} />
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
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="rideClassId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ride Class</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {rideClasses?.data.map((rideClass) => (
                        <SelectItem key={rideClass.id} value={rideClass.id}>
                          {rideClass.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="carNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Car number" />
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

export const DriverActionDialog: FC<DriverActionDialogProps> = ({
  ...props
}) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogTitle>{props.driver ? 'Edit Driver' : 'Add Driver'}</DialogTitle>
        <DriverDialogForm {...props} />
      </DialogContent>
    </Dialog>
  );
};

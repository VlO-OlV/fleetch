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
import {
  CreateDriverDto,
  createDriverSchema,
  UpdateDriverDto,
  updateDriverSchema,
} from '@/validation/driver';
import { DriverResponse } from '@/types/driver';
import { FC } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useDriver } from '@/hooks/use-driver';

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

  const form = useForm<CreateDriverDto | UpdateDriverDto>({
    resolver: zodResolver(driver ? updateDriverSchema : createDriverSchema),
    defaultValues: { ...driver },
  });

  const onSubmit = (data: CreateDriverDto | UpdateDriverDto) => {
    if (driver?.id) {
      updateDriver({ ...data });
    } else {
      createDriver({ ...data } as CreateDriverDto);
    }
  };

  const onCancel = () => {
    form.reset({ ...driver });
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
                  <Input {...field} />
                </FormControl>
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
                  <Input {...field} />
                </FormControl>
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
                  <Input {...field} />
                </FormControl>
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
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
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

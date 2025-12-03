'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { rideOrderSchema, RideOrderFormValues } from './rideOrderSchema';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon, PlusIcon, TrashIcon } from 'lucide-react';

// Dummy data for selects and options
const clients = [
  { id: '1', name: 'Client A' },
  { id: '2', name: 'Client B' },
];
const drivers = [
  { id: '1', name: 'Driver X' },
  { id: '2', name: 'Driver Y' },
];
const rideClasses = [
  { id: 'economy', label: 'Economy' },
  { id: 'business', label: 'Business' },
  { id: 'vip', label: 'VIP' },
];
const extraOptions = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'child_seat', label: 'Child Seat' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
];
const paymentTypes = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'online', label: 'Online' },
];

export function RideOrderForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<RideOrderFormValues>;
  onSubmit: (values: RideOrderFormValues) => void;
}) {
  const form = useForm<RideOrderFormValues>({
    resolver: zodResolver(rideOrderSchema),
    defaultValues: defaultValues || {
      locations: [{ address: '' }, { address: '' }],
      extraOptions: [],
      scheduled: false,
      rideClass: 'economy',
    },
  });
  const { control, watch, setValue, handleSubmit } = form;
  const locations = watch('locations');
  const scheduled = watch('scheduled');
  const scheduledDate = watch('scheduledDate');

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(() => {})}
        className="space-y-6 max-w-xl w-full"
      >
        {/* Client select */}
        <FormField
          name="clientId"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
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

        {/* Driver select */}
        <FormField
          name="driverId"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name}
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

        {/* Ride class radio buttons */}
        <FormField
          name="rideClass"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ride Class</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  {rideClasses.map((rc) => (
                    <div key={rc.id} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={rc.id}
                        checked={field.value === rc.id}
                      />
                      <Label htmlFor="r1">{rc.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Extra options checkboxes */}
        <FormField
          name="extraOptions"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Options</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  {extraOptions.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value?.includes(opt.id)}
                        onCheckedChange={(checked) => {
                          if (checked)
                            field.onChange([...(field.value || []), opt.id]);
                          else
                            field.onChange(
                              (field.value || []).filter(
                                (id: string) => id !== opt.id,
                              ),
                            );
                        }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment type select */}
        <FormField
          name="paymentType"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {paymentTypes.map((paymentType) => (
                        <SelectItem key={paymentType.id} value={paymentType.id}>
                          {paymentType.label}
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

        {/* Locations (start, end, intermediate) */}
        <div className="space-y-2">
          <Label>Locations</Label>
          {locations.map((loc, idx) => (
            <FormField
              key={idx}
              name={`locations.${idx}.address`}
              control={control}
              render={({ field }) => (
                <FormItem className="flex-row items-end">
                  <div className="flex flex-col gap-2 w-full">
                    <FormLabel>
                      {idx === 0
                        ? 'Start Location'
                        : idx === locations.length - 1
                          ? 'End Location'
                          : `Intermediate Location ${idx}`}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter address..." />
                    </FormControl>
                  </div>
                  {idx > 0 && idx < locations.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-destructive text-destructive h-9 aspect-square hover:text-destructive"
                      onClick={() =>
                        form.setValue(
                          'locations',
                          locations.filter((location, index) => index !== idx),
                        )
                      }
                    >
                      <TrashIcon />
                    </Button>
                  )}
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            className="w-full h-9"
            onClick={() =>
              form.setValue('locations', [...locations, { address: '' }])
            }
          >
            <PlusIcon />
          </Button>
        </div>

        {/* Scheduled ride toggle and date picker */}
        <FormField
          name="scheduled"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Ride</FormLabel>
              <FormControl>
                <Toggle
                  variant={'outline'}
                  pressed={field.value}
                  onPressedChange={field.onChange}
                >
                  {field.value ? 'Scheduled' : 'Immediate'}
                </Toggle>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {scheduled && (
          <FormField
            control={form.control}
            name="scheduledDate"
            render={() => (
              <FormItem>
                <FormLabel>Scheduled Date & Time</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="date-picker" className="px-1">
                        Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 h-9 justify-between font-normal"
                          >
                            {scheduledDate
                              ? scheduledDate.toLocaleDateString()
                              : 'Select date'}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              form.setValue('scheduledDate', date);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="time-picker" className="px-1">
                        Time
                      </Label>
                      <Input
                        type="time"
                        id="time-picker"
                        step="1"
                        defaultValue="10:30:00"
                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

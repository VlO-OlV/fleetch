'use client';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm, UseFormReturn } from 'react-hook-form';
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
import { ChevronDownIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { CreateRideDto } from '@/validation/ride';
import { FC, useEffect, useState } from 'react';
import { useClient } from '@/hooks/use-client';
import { useDriver } from '@/hooks/use-driver';
import { Combobox } from '@/components/ui/combobox';
import { cn, formatName } from '@/lib/utils';
import { useRideClass } from '@/hooks/use-ride-class';
import { useExtraOption } from '@/hooks/use-extra-option';
import { PaymentTypeToDetailsMap } from '@/lib/consts';
import { LocationType, PaymentType } from '@/types/ride';
import { RouteFlagStatus } from '../page';
import { DriverStatus } from '@/types/driver';

interface RideOrderFormProps {
  form: UseFormReturn<CreateRideDto>;
  onSubmit: (data: CreateRideDto) => void;
  routeFlagStatus: RouteFlagStatus;
  onRouteFlagStatusChange: (flag: RouteFlagStatus) => void;
  onEditLocation: (index: number) => void;
  editLocationIndex: number;
  routeDistance: number;
}

export const RideOrderForm: FC<RideOrderFormProps> = ({
  form,
  onSubmit,
  routeFlagStatus,
  routeDistance,
  onRouteFlagStatusChange,
  onEditLocation,
  editLocationIndex,
}) => {
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [driverSearch, setDriverSearch] = useState<string>('');
  const [clientSearch, setClientSearch] = useState<string>('');
  const [isAddressInputFocused, setIsAddressInputFocused] =
    useState<boolean>(false);
  const [focusedLocation, setFocusedLocation] = useState<number>(0);

  const clientId = form.watch('clientId');
  const driverId = form.watch('driverId');
  const locations = form.watch('locations');
  const scheduledAt = form.watch('scheduledAt');

  const { client, clients } = useClient({ search: clientSearch, id: clientId });
  const { driver, drivers } = useDriver({
    search: driverSearch,
    id: driverId,
    filterParams: { status: DriverStatus.ACTIVE },
  });
  const { rideClasses } = useRideClass({});
  const { extraOptions } = useExtraOption({});

  const { control } = form;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAddressInputFocused) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { address: locations[editLocationIndex].address },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const currentLocation = results[0].geometry.location;
              form.setValue(
                'locations',
                locations?.map((location, index) =>
                  index === editLocationIndex
                    ? {
                        ...location,
                        latitude: currentLocation.lat(),
                        longitude: currentLocation.lng(),
                      }
                    : { ...location },
                ),
              );
            }
          },
        );
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [locations?.[editLocationIndex].address]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6 max-w-xl w-full')}
      >
        <FormField
          name="clientId"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Combobox
                  triggerClassName="w-full"
                  selected={
                    clientId && client
                      ? {
                          value: clientId,
                          label: formatName(
                            client.firstName,
                            client.middleName,
                            client.lastName,
                          ),
                        }
                      : undefined
                  }
                  placeholder="Select client"
                  data={(clients?.data || []).map((c) => ({
                    value: c.id,
                    label: formatName(c.firstName, c.middleName, c.lastName),
                  }))}
                  onChange={(value) => form.setValue('clientId', value)}
                  onSearchChange={(search) => setClientSearch(search)}
                />
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
                <Combobox
                  triggerClassName="w-full"
                  selected={
                    driverId && driver
                      ? {
                          value: driverId,
                          label: formatName(
                            driver.firstName,
                            driver.middleName,
                            driver.lastName,
                          ),
                        }
                      : undefined
                  }
                  placeholder="Select driver"
                  data={(drivers?.data || []).map((d) => ({
                    value: d.id,
                    label: formatName(d.firstName, d.middleName, d.lastName),
                  }))}
                  onChange={(value) => form.setValue('driverId', value)}
                  onSearchChange={(search) => setDriverSearch(search)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="rideClassId"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ride Class</FormLabel>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  {rideClasses?.data.map((rc) => (
                    <div key={rc.id} className="flex items-center gap-3">
                      <RadioGroupItem
                        value={rc.id}
                        checked={field.value === rc.id}
                      />
                      <Label htmlFor="r1">{rc.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="rideExtraOptionIds"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Options</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {extraOptions?.data.map((opt) => (
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
                      {opt.name}
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
                <Select
                  {...field}
                  onValueChange={(value) =>
                    form.setValue('paymentType', value as PaymentType)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.entries(PaymentTypeToDetailsMap).map(
                        ([status, { label }]) => (
                          <SelectItem key={status} value={status}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Locations</Label>
          {locations?.map((loc, idx) => (
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
                      <Input
                        {...field}
                        placeholder="Enter address"
                        onFocus={() => setIsAddressInputFocused(true)}
                        disabled={
                          idx !== focusedLocation ||
                          routeFlagStatus !== RouteFlagStatus.IDLE
                        }
                      />
                    </FormControl>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 aspect-square"
                    onClick={() => {
                      onEditLocation(idx);
                      setFocusedLocation(idx);
                    }}
                  >
                    <PencilIcon />
                  </Button>
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
            disabled={locations?.length >= 10}
            onClick={() =>
              form.setValue('locations', [
                ...locations.slice(0, locations.length - 1),
                {
                  address: '',
                  latitude: 0,
                  longitude: 0,
                  type: LocationType.INTERMEDIATE,
                },
                locations[locations.length - 1],
              ])
            }
          >
            <PlusIcon />
          </Button>
        </div>

        <Toggle
          variant={'outline'}
          pressed={isScheduled}
          onPressedChange={(value) => setIsScheduled(value)}
          className="w-full"
        >
          {isScheduled ? 'Scheduled ride' : 'Immediate ride'}
        </Toggle>
        {isScheduled && (
          <FormField
            control={form.control}
            name="scheduledAt"
            render={() => (
              <FormItem>
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
                            {scheduledAt
                              ? scheduledAt.toLocaleDateString()
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
                            selected={scheduledAt}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              form.setValue('scheduledAt', date);
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
        {routeFlagStatus === RouteFlagStatus.DONE && (
          <>
            <div className="flex gap-2">
              <Label>Route distance:</Label>
              <p>{routeDistance}km</p>
            </div>
            <div className="flex gap-2">
              <Label>Total price:</Label>
              <p>${form.watch('totalPrice').toFixed(2)}</p>
            </div>
          </>
        )}
        {routeFlagStatus === RouteFlagStatus.DONE ? (
          <>
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <Button
              type="button"
              variant={'outline'}
              className="w-full"
              onClick={() => {
                onRouteFlagStatusChange(RouteFlagStatus.IDLE);
                form.setValue('totalPrice', 0);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              form.trigger().then((isValid) => {
                if (isValid)
                  onRouteFlagStatusChange(RouteFlagStatus.IN_PROGRESS);
              });
            }}
            disabled={routeFlagStatus === RouteFlagStatus.IN_PROGRESS}
          >
            Calculate route
          </Button>
        )}
      </form>
    </Form>
  );
};

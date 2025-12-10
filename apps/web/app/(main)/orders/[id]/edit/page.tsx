'use client';

import GoogleMapComponent from '@/app/(main)/live-map/components/GoogleMaps';
import { RideOrderForm } from '../../create/components/RideOrderForm';
import { useRide } from '@/hooks/use-ride';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { CreateRideDto, createRideSchema } from '@/validation/ride';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRideClass } from '@/hooks/use-ride-class';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RouteFlagStatus } from '../../create/page';
import { Route } from '@/lib/consts';

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const { updateRide, ride } = useRide({ id });
  const { rideClasses } = useRideClass({});
  const router = useRouter();

  const [routeFlagStatus, setRouteFlagStatus] = useState<RouteFlagStatus>(
    RouteFlagStatus.IDLE,
  );
  const editingRef = useRef(0);
  const [routeDistance, setRouteDistance] = useState<number>(0);

  const defaultValues = useMemo(
    () => ({
      ...ride,
      driverId: ride?.driverId || undefined,
      rideExtraOptionIds: ride?.rideExtraOptions?.map((option) => option.id),
      scheduledAt: ride?.scheduledAt ? new Date(ride.scheduledAt) : undefined,
    }),
    [ride],
  );

  const form = useForm<CreateRideDto>({
    resolver: zodResolver(createRideSchema),
    defaultValues: { ...defaultValues },
  });

  useEffect(() => {
    form.reset({ ...defaultValues });
    //if (!!defaultValues.locations) setRouteFlagStatus(RouteFlagStatus.IN_PROGRESS);
  }, [defaultValues]);

  const locations = form.watch('locations');
  const rideClassId = form.watch('rideClassId');

  const chosenRideClass = useMemo(
    () => rideClasses?.data.find((rc) => rc.id === rideClassId),
    [rideClassId, rideClasses],
  );

  const onLocationChange = useCallback(
    (latitude: number, longitude: number, address: string) => {
      form.setValue(
        'locations',
        form
          .watch('locations')
          ?.map((location, index) =>
            index === editingRef.current
              ? { ...location, latitude, longitude, address }
              : { ...location },
          ),
      );
    },
    [locations, editingRef.current],
  );

  return (
    <div className="w-full flex gap-4">
      <div className="flex flex-1">
        <RideOrderForm
          form={form}
          routeDistance={routeDistance}
          onSubmit={(values) =>
            updateRide(values, { onSuccess: () => router.push(Route.ORDERS) })
          }
          routeFlagStatus={routeFlagStatus}
          onEditLocation={(index) => (editingRef.current = index)}
          onRouteFlagStatusChange={setRouteFlagStatus}
          editLocationIndex={editingRef.current}
        />
      </div>
      <div className="w-[50%] h-full">
        <GoogleMapComponent
          locations={locations?.map((location) => ({
            lat: location.latitude,
            lng: location.longitude,
            address: location.address,
          }))}
          routeFlagStatus={routeFlagStatus}
          onLocationChange={onLocationChange}
          onRouteChange={(distance) => {
            setRouteDistance(distance);
            setRouteFlagStatus(RouteFlagStatus.DONE);
            form.setValue(
              'totalPrice',
              distance * 0.5 * (chosenRideClass?.priceCoefficient || 1),
            );
          }}
        />
      </div>
    </div>
  );
}

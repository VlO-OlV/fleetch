'use client';

import { useForm } from 'react-hook-form';
import GoogleMapComponent from '../../live-map/components/GoogleMaps';
import { RideOrderForm } from './components/RideOrderForm';
import { CreateRideDto, createRideSchema } from '@/validation/ride';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRide } from '@/hooks/use-ride';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LocationType } from '@/types/ride';
import { useUser } from '@/hooks/use-user';
import { useRideClass } from '@/hooks/use-ride-class';
import { useRouter } from 'next/navigation';
import { Route } from '@/lib/consts';

export enum RouteFlagStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export default function CreateOrderPage() {
  const { createRide } = useRide({});
  const { user } = useUser({});
  const { rideClasses } = useRideClass({});
  const router = useRouter();

  const [routeFlagStatus, setRouteFlagStatus] = useState<RouteFlagStatus>(
    RouteFlagStatus.IDLE,
  );
  const editingRef = useRef(0);
  const [routeDistance, setRouteDistance] = useState<number>(0);

  const form = useForm<CreateRideDto>({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      operatorId: user?.id,
      totalPrice: 1,
      locations: [
        {
          address: '',
          type: LocationType.START,
        },
        {
          address: '',
          type: LocationType.END,
        },
      ],
    },
  });

  const locations = form.watch('locations');
  const rideClassId = form.watch('rideClassId');

  const chosenRideClass = useMemo(
    () => rideClasses?.data.find((rc) => rc.id === rideClassId),
    [rideClassId, rideClasses],
  );

  const onLocationChange = useCallback(
    (latitude: number, longitude: number, address: string) => {
      if (routeFlagStatus !== RouteFlagStatus.IDLE) return;
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
            createRide(values, { onSuccess: () => router.push(Route.ORDERS) })
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

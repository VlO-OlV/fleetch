'use client';

import Link from 'next/link';
import GoogleMapComponent from '../../live-map/components/GoogleMaps';
import StatusBadge from '@/app/(main)/components/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import { useRide } from '@/hooks/use-ride';
import { useMemo } from 'react';
import {
  LocationTypeToLabelMap,
  PaymentTypeToDetailsMap,
  RideStatusToDetailsMap,
} from '@/lib/consts';
import { format } from 'date-fns';
import { formatName } from '@/lib/utils';
import { RouteFlagStatus } from '../create/page';

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { ride } = useRide({ id });

  const rideStatusDetails = useMemo(
    () => (!!ride ? RideStatusToDetailsMap[ride?.status] : undefined),
    [ride],
  );

  const paymentTypeDetails = useMemo(
    () => (!!ride ? PaymentTypeToDetailsMap[ride?.paymentType] : undefined),
    [ride],
  );

  return (
    <div className="min-h-screen w-full">
      <div className="h-full flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold mb-4">Order profile</h1>

          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span>{rideStatusDetails?.label || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-semibold">
                  ${(ride?.totalPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ride Class:</span>
                <span className="capitalize">
                  {ride?.rideClass.name || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <span>{paymentTypeDetails?.label || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>
                  {ride ? format(new Date(ride?.createdAt), 'dd/MM/yyyy') : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Parties Involved</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold">
                  {ride?.client
                    ? formatName(
                        ride.client.firstName,
                        ride.client.middleName,
                        ride.client.lastName,
                      )
                    : '-'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Driver</p>
                <p className="font-semibold">
                  {ride?.driver
                    ? formatName(
                        ride.driver.firstName,
                        ride.driver.middleName,
                        ride.driver.lastName,
                      )
                    : '-'}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Operator</p>
                <p className="font-semibold">
                  {ride?.operator
                    ? formatName(
                        ride.operator.firstName,
                        ride.operator.middleName,
                        ride.operator.lastName,
                      )
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Route</h2>
            <div className="space-y-3">
              {ride?.locations?.map((loc, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-600">
                    {LocationTypeToLabelMap[loc.type]}
                  </p>
                  <p className="font-semibold">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          {ride?.rideExtraOptions && (
            <div className="rounded-md bg-white p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Extra Options</h2>
              <div className="flex gap-2 flex-wrap">
                {ride.rideExtraOptions.map((opt, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded"
                  >
                    {opt.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ride?.scheduledAt && (
            <div className="rounded-md bg-white p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Scheduled Ride</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {format(new Date(ride.scheduledAt), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-[50%] h-full rounded-md bg-white shadow">
          {ride?.locations && ride.locations.length >= 2 && (
            <GoogleMapComponent
              routeFlagStatus={RouteFlagStatus.IN_PROGRESS}
              locations={ride.locations.map((location) => ({
                lat: location.latitude,
                lng: location.longitude,
                address: location.address,
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

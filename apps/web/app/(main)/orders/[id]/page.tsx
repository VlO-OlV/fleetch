'use client';

import Link from 'next/link';
import GoogleMapComponent from '../../live-map/components/GoogleMaps';
import StatusBadge from '@/app/(main)/components/StatusBadge';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';

// Mock order data - in a real app, fetch from API
function getMockOrder(id: string) {
  return {
    id,
    clientName: `Client ${parseInt(id) - 1000 + 1}`,
    driverName: `Driver ${((parseInt(id) - 1000) % 27) + 1}`,
    operatorName: `Operator ${((parseInt(id) - 1000) % 5) + 1}`,
    status: (['delivered', 'in transit', 'pending', 'cancelled'] as const)[
      (parseInt(id) - 1000) % 4
    ],
    paymentType: (['cash', 'card', 'online'] as const)[
      (parseInt(id) - 1000) % 3
    ],
    totalPrice: 200.45,
    rideClass: (['economy', 'business', 'vip'] as const)[
      (parseInt(id) - 1000) % 3
    ],
    locations: [
      { label: 'Start', address: '123 Main St, City A' },
      ...((parseInt(id) - 1000) % 2 === 0
        ? [{ label: 'Intermediate', address: '456 Middle Ave, City B' }]
        : []),
      { label: 'End', address: '789 End St, City C' },
    ],
    extraOptions: [
      (['wifi', 'child_seat', 'pet_friendly'] as const)[
        (parseInt(id) - 1000) % 3
      ],
    ],
    scheduled: (parseInt(id) - 1000) % 2 === 0,
    scheduledDate: new Date(
      54 * 365 * 24 * 60 * 60 * 1000,
    ).toLocaleDateString(),
    scheduledTime: '14:30',
    createdAt: new Date(
      54 * 365 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000,
    ).toLocaleString(),
  };
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const order = getMockOrder(id);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'in transit':
        return 'info';
      default:
        return 'neutral';
    }
  };

  const getPaymentVariant = (type: string) => {
    switch (type) {
      case 'cash':
        return 'neutral';
      case 'card':
        return 'info';
      default:
        return 'success';
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="h-full flex gap-6">
        {/* Left side - Order details */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold mb-4">Order profile</h1>

          {/* Order summary */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <StatusBadge variant={getStatusVariant(order.status)}>
                  {order.status}
                </StatusBadge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ride Class:</span>
                <span className="capitalize">{order.rideClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Type:</span>
                <StatusBadge variant={getPaymentVariant(order.paymentType)}>
                  {order.paymentType}
                </StatusBadge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span>{order.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Parties involved */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Parties Involved</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold">{order.clientName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Driver</p>
                <p className="font-semibold">{order.driverName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-600">Operator</p>
                <p className="font-semibold">{order.operatorName}</p>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="rounded-md bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Route</h2>
            <div className="space-y-3">
              {order.locations.map((loc, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-600">{loc.label}</p>
                  <p className="font-semibold">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Options */}
          {order.extraOptions.length > 0 && (
            <div className="rounded-md bg-white p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Extra Options</h2>
              <div className="flex gap-2 flex-wrap">
                {order.extraOptions.map((opt) => (
                  <span
                    key={opt}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled info */}
          {order.scheduled && (
            <div className="rounded-md bg-white p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Scheduled Ride</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{order.scheduledDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{order.scheduledTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Map */}
        <div className="w-[50%] h-full rounded-md bg-white shadow">
          <GoogleMapComponent />
        </div>
      </div>
    </div>
  );
}

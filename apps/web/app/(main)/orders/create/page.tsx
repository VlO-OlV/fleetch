'use client';

import GoogleMapComponent from '../../live-map/components/GoogleMaps';
import { RideOrderForm } from '../RideOrderForm';

export default function CreateOrderPage() {
  return (
    <div className="w-full flex gap-4">
      <div className="flex flex-1">
        <RideOrderForm onSubmit={(values) => {}} />
      </div>
      <div className="w-[50%] h-full">
        <GoogleMapComponent />
      </div>
    </div>
  );
}

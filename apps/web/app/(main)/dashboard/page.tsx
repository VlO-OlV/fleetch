'use client';

import RidesByPaymentPie from '@/components/charts/RidesByPaymentPie';
import IncomeByRideClassPie from '@/components/charts/IncomeByRideClassPie';

export default function DashboardPage() {
  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-white p-4 shadow">Orders: 128</div>
          <div className="rounded-md bg-white p-4 shadow">Clients: 54</div>
          <div className="rounded-md bg-white p-4 shadow">Drivers: 23</div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
          <RidesByPaymentPie />
          <IncomeByRideClassPie />
        </div>
      </main>
    </div>
  );
}

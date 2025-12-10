'use client';

import RidesByPaymentPie from '@/components/charts/RidesByPaymentPie';
import IncomeByRideClassPie from '@/components/charts/IncomeByRideClassPie';
import { useRide } from '@/hooks/use-ride';
import { useI18n } from '@/lib/i18n';
import { useUser } from '@/hooks/use-user';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/user';
import { Route } from '@/lib/consts';

export default function DashboardPage() {
  const { generalStats } = useRide({});
  const { t } = useI18n();
  const router = useRouter();
  const { user, isLoading } = useUser({});

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.ADMIN) {
      router.push(Route.LIVE_MAP);
    }
  }, [user, isLoading]);

  if (!user) return null;

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">
          {t('dashboard.title', 'Dashboard')}
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-white p-4 shadow">
            {t('dashboard.orders', 'Orders')}: {generalStats?.rideCount || 0}
          </div>
          <div className="rounded-md bg-white p-4 shadow">
            {t('dashboard.clients', 'Clients')}:{' '}
            {generalStats?.clientCount || 0}
          </div>
          <div className="rounded-md bg-white p-4 shadow">
            {t('dashboard.drivers', 'Drivers')}:{' '}
            {generalStats?.driverCount || 0}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
          <RidesByPaymentPie />
          <IncomeByRideClassPie />
        </div>
      </main>
    </div>
  );
}

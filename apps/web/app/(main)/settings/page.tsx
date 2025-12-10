'use client';

import { useUser } from '@/hooks/use-user';
import { ExtraOptionsForm } from './components/ExtraOptionsForm';
import { RideClassesForm } from './components/RideClassesForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '@/lib/consts';
import { UserRole } from '@/types/user';

export default function SettingsPage() {
  const { user, isLoading } = useUser({});
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.ADMIN) {
      router.push(Route.LIVE_MAP);
    }
  }, [user, isLoading]);

  if (!user) return null;

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        <div className="flex gap-6 max-md:flex-col items-start">
          <div className="flex flex-1">
            <ExtraOptionsForm />
          </div>
          <div className="flex flex-1">
            <RideClassesForm />
          </div>
        </div>
      </main>
    </div>
  );
}

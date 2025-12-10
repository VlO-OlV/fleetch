'use client';

import { ExtraOptionsForm } from './components/ExtraOptionsForm';
import { RideClassesForm } from './components/RideClassesForm';

export default function SettingsPage() {
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

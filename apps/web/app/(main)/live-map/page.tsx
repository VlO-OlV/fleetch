'use client';
import { useI18n } from '@/lib/i18n';
import GoogleMaps from './components/GoogleMaps';

export default function LiveMapPage() {
  const { t } = useI18n();

  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">
          {t('menu.liveMap', 'Live map')}
        </h1>
        <div className="rounded-md bg-white p-8 shadow w-full h-[700px]">
          <GoogleMaps />
        </div>
      </main>
    </div>
  );
}

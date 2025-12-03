'use client';
import GoogleMaps from './components/GoogleMaps';

export default function LiveMapPage() {
  return (
    <div className="w-full">
      <main>
        <h1 className="text-2xl font-semibold mb-4">Live map</h1>
        <div className="rounded-md bg-white p-8 shadow w-full h-[500px]">
          <GoogleMaps />
        </div>
      </main>
    </div>
  );
}

"use client"
import GoogleMaps from "./components/GoogleMaps"

export default function LiveMapPage() {
  return (
    <div className="w-full bg-zinc-50">
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Live map</h1>
        <div className="rounded-md bg-white p-8 shadow">
          <GoogleMaps />
        </div>
      </main>
    </div>
  )
}

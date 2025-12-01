'use client';

export default function DashboardPage() {
  return (
    <div className="w-full bg-zinc-50">
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-white p-4 shadow">Orders: 128</div>
          <div className="rounded-md bg-white p-4 shadow">Clients: 54</div>
          <div className="rounded-md bg-white p-4 shadow">Drivers: 23</div>
        </div>
      </main>
    </div>
  );
}

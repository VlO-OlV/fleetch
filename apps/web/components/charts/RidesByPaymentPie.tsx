'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type DataItem = { name: string; value: number; fill?: string };

export default function RidesByPaymentPie({ data }: { data?: DataItem[] }) {
  const sample: DataItem[] = [
    { name: 'Cash', value: 120, fill: '#60A5FA' },
    { name: 'Card', value: 260, fill: '#34D399' },
    { name: 'Wallet', value: 45, fill: '#F59E0B' },
  ];

  const chartData = data ?? sample;

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <h3 className="text-lg font-medium mb-2">Rides by payment type</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

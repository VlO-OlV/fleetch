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

type DataItem = { name: string; value: number; fill: string };

export default function IncomeByRideClassPie({ data }: { data?: DataItem[] }) {
  const sample: DataItem[] = [
    { name: 'Economy', value: 4200, fill: '#A78BFA' },
    { name: 'Business', value: 8200, fill: '#FB7185' },
    { name: 'Premium', value: 3200, fill: '#34D399' },
  ];

  const chartData = data ?? sample;

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <h3 className="text-lg font-medium mb-2">Income by ride class</h3>
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
              label
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Number(value))
              }
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

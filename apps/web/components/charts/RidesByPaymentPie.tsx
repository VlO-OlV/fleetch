'use client';

import { useRide } from '@/hooks/use-ride';
import { PaymentTypeToDetailsMap } from '@/lib/consts';
import { PaymentType } from '@/types/ride';
import { useMemo } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RidesByPaymentPie() {
  const { paymentTypeStats } = useRide({});

  const chartData = useMemo(
    () => [
      {
        label: PaymentTypeToDetailsMap[PaymentType.CASH].label,
        value: paymentTypeStats?.cashCount || 0,
        fill: PaymentTypeToDetailsMap[PaymentType.CASH].color,
      },
      {
        label: PaymentTypeToDetailsMap[PaymentType.CARD].label,
        value: paymentTypeStats?.cardCount || 0,
        fill: PaymentTypeToDetailsMap[PaymentType.CARD].color,
      },
      {
        label: PaymentTypeToDetailsMap[PaymentType.CRYPTO].label,
        value: paymentTypeStats?.cryptoCount || 0,
        fill: PaymentTypeToDetailsMap[PaymentType.CRYPTO].color,
      },
    ],
    [paymentTypeStats],
  );

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <h3 className="text-lg font-medium mb-2">Rides by payment type</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

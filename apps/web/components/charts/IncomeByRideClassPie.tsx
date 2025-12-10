'use client';

import { useRide } from '@/hooks/use-ride';
import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function IncomeByRideClassPie() {
  const { incomeStats } = useRide({});

  const highContrastPalette = useMemo(
    () => [
      '#FF3838',
      '#FF851B',
      '#FFDC00',
      '#2ECC40',
      '#3DDB85',
      '#008FFB',
      '#006FEA',
      '#B10DC9',
      '#F012BE',
      '#85144B',
      '#FF4136',
      '#FF851B',
      '#FF6F61',
      '#39CCCC',
      '#01FF70',
      '#7FDBFF',
      '#B10DC9',
      '#FFD700',
      '#FF6347',
      '#4B0082',
    ],
    [],
  );

  const chartData = useMemo(
    () =>
      incomeStats?.map((stats, index) => ({
        ...stats,
        fill: highContrastPalette[index],
      })),
    [incomeStats],
  );

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <h3 className="text-lg font-medium mb-2">Income by ride class</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="totalIncome"
              nameKey="rideClass"
              cx="50%"
              cy="50%"
              outerRadius={80}
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(+Number(value).toFixed(2))
              }
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export type BadgeVariant =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export default function StatusBadge({
  children,
  variant = 'neutral',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  const base =
    'inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium';
  const variants: Record<BadgeVariant, string> = {
    neutral: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800',
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}

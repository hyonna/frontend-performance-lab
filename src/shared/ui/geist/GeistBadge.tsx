import { clsx } from 'clsx';
import type React from 'react';

interface GeistBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'blue' | 'rose' | 'mono' | 'emerald' | 'amber';
  className?: string;
}

export function GeistBadge({ children, variant = 'default', className }: GeistBadgeProps) {
  const variantStyles = {
    default: 'bg-neutral-100 text-black border-neutral-300 font-semibold',
    mono: 'bg-neutral-100 text-black border-neutral-300 font-mono font-bold',
    blue: 'bg-blue-50 text-blue-900 border-blue-200 font-bold',
    emerald: 'bg-blue-50 text-blue-900 border-blue-200 font-bold',
    rose: 'bg-neutral-100 text-neutral-600 border-neutral-300 font-bold',
    amber: 'bg-neutral-100 text-neutral-600 border-neutral-300 font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm border',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

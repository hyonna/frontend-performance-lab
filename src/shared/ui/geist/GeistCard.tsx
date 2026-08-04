import { clsx } from 'clsx';
import type React from 'react';

interface GeistCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function GeistCard({ children, className, hoverable = false, ...props }: GeistCardProps) {
  return (
    <div
      className={clsx(
        'bg-geist-card border border-geist-border rounded-xl p-6 transition-all duration-200 shadow-sm',
        hoverable && 'hover:border-neutral-300 hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

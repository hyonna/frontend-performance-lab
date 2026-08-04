import { clsx } from 'clsx';
import type React from 'react';

interface GeistButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function GeistButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: GeistButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-sm';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm h-9 font-medium',
    md: 'px-4 py-2 text-sm h-10 font-semibold',
    lg: 'px-5 py-2.5 text-base h-11 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-neutral-800 border border-black shadow-sm',
    secondary: 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-300',
    outline:
      'bg-white text-black hover:text-black border border-neutral-300 hover:border-black hover:bg-neutral-50',
    ghost: 'bg-transparent text-black hover:bg-neutral-100',
    danger:
      'bg-neutral-100 text-neutral-700 border border-neutral-300 hover:bg-neutral-200 font-bold',
    success: 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 font-bold',
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

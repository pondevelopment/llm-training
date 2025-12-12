import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Chip({ children, variant = 'default', className = '' }: ChipProps) {
  const variantClasses = {
    default: 'chip',
    info: 'chip chip-info',
    success: 'chip chip-success',
    warning: 'chip chip-warning',
    error: 'chip chip-error',
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Panel({ children, variant = 'default', className = '' }: PanelProps) {
  const variantClasses = {
    default: 'panel',
    info: 'panel panel-info',
    success: 'panel panel-success',
    warning: 'panel panel-warning',
    error: 'panel panel-error',
  };

  return (
    <div className={`${variantClasses[variant]} p-6 ${className}`}>
      {children}
    </div>
  );
}

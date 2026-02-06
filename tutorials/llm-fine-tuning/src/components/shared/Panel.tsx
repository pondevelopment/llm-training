import type { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'neutral' | 'neutral-soft';
  className?: string;
}

export function Panel({ children, variant = 'default', className = '' }: PanelProps) {
  const variantClasses = {
    default: 'panel',
    info: 'panel panel-info',
    success: 'panel panel-success',
    warning: 'panel panel-warning',
    neutral: 'panel panel-neutral',
    'neutral-soft': 'panel panel-neutral-soft',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

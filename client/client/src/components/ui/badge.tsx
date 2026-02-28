import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-[hsl(217_91%_60%)] text-white hover:bg-[hsl(217_91%_50%)]',
    secondary: 'border-transparent bg-[hsl(210_40%_96%)] text-[hsl(222_47%_11%)] hover:bg-[hsl(210_40%_90%)]',
    destructive: 'border-transparent bg-[hsl(0_84%_60%)] text-white hover:bg-[hsl(0_84%_50%)]',
    outline: 'text-[hsl(222_47%_11%)] border border-[hsl(214_32%_91%)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(217_91%_60%)] focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
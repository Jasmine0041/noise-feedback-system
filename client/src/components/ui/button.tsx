import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-[hsl(217_91%_60%)] text-white hover:bg-[hsl(217_91%_50%)]',
      destructive: 'bg-[hsl(0_84%_60%)] text-white hover:bg-[hsl(0_84%_50%)]',
      outline: 'border border-[hsl(214_32%_91%)] bg-white hover:bg-[hsl(210_40%_96%)]',
      secondary: 'bg-[hsl(210_40%_96%)] text-[hsl(222_47%_11%)] hover:bg-[hsl(210_40%_90%)]',
      ghost: 'hover:bg-[hsl(210_40%_96%)]',
      link: 'text-[hsl(217_91%_60%)] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(217_91%_60%)] disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
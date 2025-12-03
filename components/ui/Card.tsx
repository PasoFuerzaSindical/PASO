
import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative group rounded-xl">
        {/* Holographic Border Beam - Visible in Dark Mode */}
        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-ugt-green via-cyber-violet to-ugt-red opacity-0 dark:opacity-30 dark:blur-[2px] dark:group-hover:opacity-100 dark:group-hover:blur-[4px] transition-all duration-500"></div>
        
        {/* Rotating Light Effect (Subtle) - Visible in Dark Mode */}
        <div className="absolute -inset-[1px] rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute inset-[-100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_50%,#0aff60_100%)] opacity-0 dark:group-hover:opacity-30 transition-opacity duration-500"></div>
        </div>

        {/* Card Background & Content */}
        <div
            ref={ref}
            className={cn(
                'relative rounded-xl border border-border bg-card backdrop-blur-xl text-card-foreground shadow-lg transition-colors duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    </div>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-bold leading-none tracking-tight text-foreground drop-shadow-sm', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground font-medium', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

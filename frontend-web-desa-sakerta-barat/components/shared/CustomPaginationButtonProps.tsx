import React from 'react';
import { PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { cn } from '@/lib/utils'; // Pastikan Anda memiliki fungsi cn dari Shadcn UI

interface CustomPaginationButtonProps
  extends React.ComponentProps<typeof PaginationNext> {
  disabled?: boolean;
  direction: 'next' | 'previous';
}

const CustomPaginationButton: React.FC<CustomPaginationButtonProps> = ({
  className,
  disabled,
  direction,
  ...props
}) => {
  const Component = direction === 'next' ? PaginationNext : PaginationPrevious;

  return (
    <Component
      {...props}
      className={cn(
        className,
        'font-normal text-sm text-[#9E9E9E]',
        disabled && 'pointer-events-none opacity-50',
      )}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        props.onClick?.(e);
      }}
    />
  );
};

export default CustomPaginationButton;

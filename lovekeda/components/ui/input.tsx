import * as React from 'react';
import { TextInput, View } from 'react-native';

import { cn } from '~/lib/utils';

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  }
>(({ className, startIcon, endIcon, placeholderClassName, textAlignVertical, ...props }, ref) => {
  return (
    <View className="relative">
      {startIcon && (
        <View className="absolute left-1 top-1/2 z-50 -translate-y-1/2">{startIcon}</View>
      )}
      <TextInput
        ref={ref}
        className={cn(
          'native:h-12 border-input bg-background native:text-lg native:leading-[1.25] text-muted-foreground placeholder:text-muted-foreground web:ring-offset-background web:focus-visible:ring-ring h-10 rounded-md border px-3 text-base file:border-0 file:bg-transparent file:font-medium web:flex web:w-full web:py-2 web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-offset-2 lg:text-sm',
          props.editable === false && 'opacity-50 web:cursor-not-allowed',
          startIcon && '!pl-10',
          endIcon && '!pr-10',
          className
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        textAlignVertical={textAlignVertical}
        {...props}
      />
      {endIcon && <View className="absolute right-1 top-1/2 z-50 -translate-y-1/2">{endIcon}</View>}
    </View>
  );
});

Input.displayName = 'Input';

export { Input };

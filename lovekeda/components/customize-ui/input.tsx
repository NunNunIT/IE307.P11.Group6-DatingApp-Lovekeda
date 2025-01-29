import * as React from 'react';
import { TextInput, View } from 'react-native';

import { Input as RNRInput } from '~/components/ui/input';
import { cn } from '~/lib/utils';

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> & {
    childLeft?: React.ReactNode;
    childRight?: React.ReactNode;
  }
>(({ className, childLeft, childRight, ...props }, ref) => {
  return childLeft || childRight ? (
    <View className="relative">
      {childLeft && (
        <View className="absolute left-1 top-1/2 z-50 -translate-y-1/2">{childLeft}</View>
      )}
      <RNRInput
        ref={ref}
        className={cn(childLeft && 'pl-10', childRight && 'pr-10', className)}
        {...props}
      />
      {childRight && (
        <View className="absolute right-1 top-1/2 z-50 -translate-y-1/2">{childRight}</View>
      )}
    </View>
  ) : (
    <RNRInput ref={ref} {...props} />
  );
});

Input.displayName = 'Input';

export { Input };

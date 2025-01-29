import React, { useCallback, useState } from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable } from 'react-native';

import { Button, ButtonProps } from '../ui/button';
import { Text } from '../ui/text';

import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

const StateButton = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, disabled, onPress, children, ...props }, ref) => {
    const [isPending, setIsPending] = useState(false);
    const { isDarkColorScheme } = useColorScheme();
    const handlePress = useCallback(
      async (event: GestureResponderEvent) => {
        if (!onPress) return;

        setIsPending(true);
        try {
          await onPress(event);
        } catch (error) {
          console.error('Error in StateButton onPress:', error);
        } finally {
          setIsPending(false);
        }
      },
      [onPress]
    );

    return (
      <Button
        ref={ref}
        className={cn(className, isPending && 'flex flex-row items-center justify-center')}
        disabled={disabled || isPending}
        onPress={handlePress}
        {...props}>
        {isPending ? (
          <>
            <ActivityIndicator
              className={cn(props.size !== 'icon' && '-ml-2 pr-2')}
              size="small"
              color={isDarkColorScheme ? 'dark' : 'white'}
            />
            {props.size === 'icon' ? null : <Text>Loading...</Text>}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);
StateButton.displayName = 'StateButton';

export { StateButton };

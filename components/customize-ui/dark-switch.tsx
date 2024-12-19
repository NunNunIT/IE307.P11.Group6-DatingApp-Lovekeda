import * as SwitchPrimitives from '@rn-primitives/switch';
import * as React from 'react';
import { Platform } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';

const SwitchWeb = React.forwardRef<
  Omit<React.ElementRef<typeof SwitchPrimitives.Root>, 'checked' | 'onCheckedChange'>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'checked' | 'onCheckedChange'>
>(({ className, ...props }, ref) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isOn = colorScheme === 'dark';

  return (
    <SwitchPrimitives.Root
      className={cn(
        'peer h-6 w-11 shrink-0 cursor-pointer flex-row items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed',
        isOn ? 'bg-primary' : 'bg-input',
        className
      )}
      checked={isOn}
      onCheckedChange={toggleColorScheme}
      {...props}
      ref={ref}>
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md shadow-foreground/5 ring-0 transition-transform',
          isOn ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
});

SwitchWeb.displayName = 'SwitchWeb';

const RGB_COLORS = {
  light: {
    off: 'rgb(228, 228, 231)', // Light gray for off state in light mode
  },
  dark: {
    on: 'rgb(250, 250, 250)', // Dark gray for on state in dark mode
  },
} as const;

const THUMB_POSITION = { off: 0, on: 18 };
const ANIMATION_DURATION = 200;

const SwitchNative = React.forwardRef<
  Omit<React.ElementRef<typeof SwitchPrimitives.Root>, 'checked' | 'onCheckedChange'>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, 'checked' | 'onCheckedChange'>
>(({ className, ...props }, ref) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isOn = colorScheme === 'dark';

  const translateX = useDerivedValue(() => (isOn ? THUMB_POSITION.on : THUMB_POSITION.off));

  const animatedRootStyle = useAnimatedStyle(
    () => ({
      backgroundColor: isOn ? RGB_COLORS.dark.on : RGB_COLORS.light.off,
    }),
    [isOn]
  );

  const animatedThumbStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: withTiming(translateX.value, { duration: ANIMATION_DURATION }),
        },
      ],
    }),
    [translateX.value]
  );

  return (
    <Animated.View
      style={animatedRootStyle}
      className={cn('h-8 w-[46px] rounded-full', props.disabled && 'opacity-50')}>
      <SwitchPrimitives.Root
        className={cn(
          'h-8 w-[46px] shrink-0 flex-row items-center rounded-full border-2 border-transparent',
          className
        )}
        checked={isOn}
        onCheckedChange={toggleColorScheme}
        {...props}
        ref={ref}>
        <Animated.View style={animatedThumbStyle}>
          <SwitchPrimitives.Thumb className="h-7 w-7 rounded-full bg-background shadow-md shadow-foreground/25 ring-0" />
        </Animated.View>
      </SwitchPrimitives.Root>
    </Animated.View>
  );
});

SwitchNative.displayName = 'SwitchNative';

const DarkSwitch = Platform.select({
  web: SwitchWeb,
  default: SwitchNative,
});

export { DarkSwitch };

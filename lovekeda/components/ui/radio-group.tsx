import * as React from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';

import { Label } from './label';
import { cn } from '@/lib/utils';

interface RadioGroupProps {
  defaultValue?: string;
  onValueChange?: (val: string) => void;
  disabled?: boolean;
}

interface IRadioGroupContext {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onValueChange?: (val: string) => void;
  disabled: boolean;
}

const RadioGroupContext = React.createContext({} as IRadioGroupContext);

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & RadioGroupProps
>(({ defaultValue = '', onValueChange, className, disabled = false, ...props }, ref) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <RadioGroupContext.Provider
      value={{
        value,
        setValue,
        disabled,
        onValueChange,
      }}>
      <View role="radiogroup" ref={ref} className={cn('gap-2', className)} {...props} />
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error(
      'RadioGroup compound components cannot be rendered outside the RadioGroup component'
    );
  }
  return context;
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  Omit<React.ComponentPropsWithoutRef<typeof Pressable>, 'disabled'> & {
    name: string;
    labelClass?: string;
    buttonClass?: string;
    innerButtonClass?: string;
    children?: string;
  }
>(
  (
    { className, name, labelClass, buttonClass, innerButtonClass, onPress, children, ...props },
    ref
  ) => {
    const { value, setValue, disabled, onValueChange } = useRadioGroupContext();

    function handleOnPress(ev: GestureResponderEvent) {
      setValue(name);
      onValueChange?.(name);
      onPress?.(ev);
    }

    return (
      <View className={cn('flex-row items-center gap-3', className)}>
        <Pressable
          disabled={disabled}
          onPress={handleOnPress}
          className={cn(
            'native:[borderWidth:1.5] h-6 w-6 items-center justify-center rounded-full border-primary web:border',
            buttonClass
          )}
          aria-labelledby={name}
          accessibilityState={{ selected: value === name }}
          role="radio"
          {...props}>
          {value === name && (
            <View ref={ref} className={cn('h-3 w-3 rounded-full bg-primary', innerButtonClass)} />
          )}
        </Pressable>
        <Label onPress={handleOnPress} className={cn('text-xl', labelClass)} nativeID={name}>
          {children}
        </Label>
      </View>
    );
  }
);

export { RadioGroup, RadioGroupItem };
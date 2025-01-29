import * as LabelPrimitive from '@rn-primitives/label';
import { SlottableTextProps, TextRef } from '@rn-primitives/types';
import * as React from 'react';
import {
  Controller,
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  UseFormStateReturn,
} from 'react-hook-form';
import { View, ViewProps } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { Label } from '../ui/label';
import { Text } from '../ui/text';

import { cn } from '~/lib/utils';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  render,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  render: (props: {
    field: Omit<ControllerRenderProps<TFieldValues, TName>, 'onChange'> & {
      onChangeText: (value: string) => void;
    };
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
}) => {
  return (
    <Controller
      render={({ field: { onChange, ...restField }, ...rest }) =>
        render({ field: { onChangeText: onChange, ...restField }, ...rest })
      }
      {...props}
    />
  );
};

const useFormField = () => {
  const itemContext = React.useContext(FormItemContext);
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-red-500', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <Text
        ref={ref}
        id={formDescriptionId}
        className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)}
        {...props}
      />
    );
  }
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<TextRef, SlottableTextProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) return null;

    return (
      <Animated.View entering={FadeInDown} exiting={FadeOut.duration(275)}>
        <Text
          ref={ref}
          id={formMessageId}
          className={cn('text-xs font-medium text-red-500', className)}
          {...props}>
          {body}
        </Text>
      </Animated.View>
    );
  }
);
FormMessage.displayName = 'FormMessage';

const FormController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  name,
  description,
  render,
  className,
  ...props
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  render: (props: {
    field: Omit<ControllerRenderProps<TFieldValues, TName>, 'onChange'> & {
      onChangeText: (value: string) => void;
    };
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
} & ViewProps & { label: string; description?: string }) => (
  <FormItem className={cn(className, 'mb-4')}>
    <FormFieldContext.Provider value={{ name }}>
      <FormLabel>{label}</FormLabel>
      <FormField {...{ name, render }} />
      <FormMessage />
      {description && <FormDescription>{description}</FormDescription>}
    </FormFieldContext.Provider>
  </FormItem>
);

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormController,
  FormDescription,
  // FormMessage,
  FormField,
};
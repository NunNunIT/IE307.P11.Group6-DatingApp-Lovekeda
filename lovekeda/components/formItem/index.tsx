// 21522436 - Nguyễn Thị Hồng Nhung
import React from 'react';
import { View } from 'react-native';

import { Label } from '../ui/label';
import { Text } from '../ui/text';
export const FormItem = ({
  name,
  label,
  required = false,
  error,
  children,
}: {
  name?: string;
  label?: string;
  required?: boolean;
  error?: string;
  children: any;
}) => (
  <View className="relative mb-5 w-full">
    {label && (
      <Label
        htmlFor={name || ''}
        className="text-lg font-semibold text-zinc-800 dark:text-zinc-300">
        {label}
        {required && <Text className="text-red-500 dark:text-red-500">*</Text>}
      </Label>
    )}
    {children}
    <Text className="absolute -bottom-5 right-0 !text-xs text-red-500 dark:text-red-500">
      {error}
    </Text>
  </View>
);

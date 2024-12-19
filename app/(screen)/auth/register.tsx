// import libs
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, Platform, View } from 'react-native';
import { z } from 'zod';
import { toast } from 'sonner-native';

// Import components
import { Form, FormController } from '@/components/customize-ui/form';
import { Input } from '@/components/customize-ui/input';
import { PasswordInput } from '@/components/customize-ui/password-input';
import { StateButton } from '@/components/customize-ui/state-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Lock, Mail, User } from '@/lib/icons';
import { DEFAULT_REGISTER_FORM_VALUES, registerFormSchema } from '@/utils/form/register';
import { supabase } from '@/utils/supabase';
import { SafeAreaView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { cn } from '@/lib/utils';
import DarkModeButton from '@/components/darkModeOption/button';

export default function RegisterScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof registerFormSchema>>({
    defaultValues: DEFAULT_REGISTER_FORM_VALUES,
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = useCallback(async (data: z.infer<typeof registerFormSchema>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) throw error;

      toast.success('Register Successful!!!');
    } catch (error) {
      if (!(error instanceof Error)) {
        toast.error('An unexpected error occurred');
        return;
      }

      if (error.message.includes('User already registered')) {
        form.setError('email', { type: 'manual', message: 'This email already used' });
        return;
      }

      toast.error(error.message);
    }
  }, []);

  return (
    <SafeAreaView className={cn(Platform.OS === 'android' ? 'pt-16' : 'pt-0', 'flex-1')}>
      <Spinner visible={form.formState.isSubmitting} />
      <View className='px-6'>
        <Form {...form}>
          <FormController
            name="name"
            label="Name:"
            render={({ field }) => (
              <Input
                childLeft={<User className="ml-1 size-6 text-zinc-500" />}
                autoCapitalize="words"
                placeholder="Enter your name"
                {...field}
              />
            )}
          />

          <FormController
            name="email"
            label="Email:"
            render={({ field }) => (
              <Input
                childLeft={<Mail className="ml-1 size-6 text-zinc-500" />}
                autoCapitalize="none"
                placeholder="Enter your email"
                {...field}
              />
            )}
          />

          <FormController
            name="password"
            label="Password:"
            render={({ field }) => (
              <PasswordInput
                childLeft={<Lock className="ml-1 size-6 text-zinc-500" />}
                autoCapitalize="none"
                placeholder="Enter your password"
                {...field}
              />
            )}
          />

          <FormController
            name="passwordConfirm"
            label="Password Confimation:"
            render={({ field }) => (
              <PasswordInput
                childLeft={<Lock className="ml-1 size-6 text-zinc-500" />}
                autoCapitalize="none"
                placeholder="Repeat your password"
                {...field}
              />
            )}
          />

          <StateButton
            variant="red"
            onPress={form.handleSubmit(async (data) => {
              Keyboard.dismiss();
              await onSubmit(data);
            })}>
            <Text>Submit</Text>
          </StateButton>
        </Form>

        <View className="mx-4 flex flex-row items-center justify-center py-4">
          <Separator />
          <Text className="mx-4 text-lg font-bold">OR</Text>
          <Separator />
        </View>

        <Button
          variant="ghost"
          className="flex flex-row"
          onPress={() => router.replace('/(screen)/auth/login')}>
          <Text>Đã tài khoản rồi? </Text>
          <Text className="font-bold underline">Đăng nhập ngay</Text>
        </Button>

        <DarkModeButton />
      </View>
    </SafeAreaView>
  );
}

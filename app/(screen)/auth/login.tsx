// 21522436 - Nguyễn Thị Hồng Nhung

import { PasswordInput } from "@/components/customize-ui/password-input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/provider/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { Alert, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { FormItem } from "~/components/formItem";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Mail, Lock } from "~/lib/icons";
import { supabase } from "~/utils/supabase";

// Định nghĩa schema Zod cho form
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithPassword } = useAuth();

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Hàm submit
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginWithPassword(data);
      console.log("🚀 ~ onSubmit ~ result:", result);
    } catch (error: any) {
      if (error.message.includes("auth/invalid-credential")) {
        setError("email", {
          type: "manual",
          message: "Invalid email or password",
        });
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
        return;
      }

      console.error("🚀 ~ onSubmit ~ error:", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Spinner visible={isSubmitting} />
      <View className="w-full flex-1 gap-2 justify-center items-center px-6 py-3">
        <FormItem
          name="email"
          label="Email"
          error={errors?.email?.message}
          required
        >
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="john@example.com"
                value={value}
                startIcon={<Mail className="ml-1 size-6 text-zinc-500" />}
              />
            )}
          />
        </FormItem>

        <FormItem
          name="password"
          label="Mật khẩu"
          error={errors?.password?.message}
          required
        >
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                childLeft={<Lock className="ml-1 size-6 text-zinc-500" />}
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Nhập mật khẩu"
              />
            )}
          />
        </FormItem>

        <Button
          className="w-full"
          variant="red"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-lg font-semibold text-white">Đăng nhập</Text>
        </Button>

        <View className="mx-4 flex flex-row items-center py-4">
          <Separator className="w-full" />
          <Text className="mx-4 text-lg font-bold">OR</Text>
          <Separator className="w-full" />
        </View>

        <Button
          variant="ghost"
          className="flex flex-row w-full"
          onPress={() => router.replace("/(screen)/auth/register")}
        >
          <Text>Chưa có tài khoản rồi? </Text>
          <Text className="font-bold underline">Đăng ký ngay</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

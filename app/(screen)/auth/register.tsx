import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Keyboard, Platform, View } from "react-native";
import { z } from "zod";

import { Form, FormController } from "@/components/customize-ui/form";
import { Input } from "@/components/customize-ui/input";
import { PasswordInput } from "@/components/customize-ui/password-input";
import { StateButton } from "@/components/customize-ui/state-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Lock, Mail } from "@/lib/icons";
import {
  DEFAULT_REGISTER_FORM_VALUES,
  registerFormSchema,
} from "@/utils/form/register";
import { SafeAreaView } from "react-native";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterScreen() {
  const { registerWithPassword } = useAuth();
  const form = useForm<z.infer<typeof registerFormSchema>>({
    defaultValues: DEFAULT_REGISTER_FORM_VALUES,
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    try {
      await registerWithPassword(data);
    } catch (error: any) {
      if (error.message.includes("auth/email-already-in-use")) {
        form.setError("email", {
          type: "manual",
          message: "This email already used",
        });
        return;
      }
      console.error("🚀 ~ onSubmit ~ error:", error);
    }
  };

  return (
    <SafeAreaView
      className={cn(Platform.OS === "android" ? "pt-16" : "pt-0", "flex-1")}
    >
      <View className="px-6">
        <Form {...form}>
          <FormController
            name="email"
            label="Email:"
            render={({ field }) => (
              <Input
                childLeft={<Mail className="ml-1 size-6 text-zinc-500" />}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Nhập email của bạn"
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
                placeholder="Nhâp mật khẩu của bạn"
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
                placeholder="Nhập lại mật khẩu"
                {...field}
              />
            )}
          />

          <StateButton
            variant="red"
            onPress={form.handleSubmit(async (data) => {
              Keyboard.dismiss();
              await onSubmit(data);
            })}
          >
            <Text>Đăng ký</Text>
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
          onPress={() => router.replace("/(screen)/auth/login")}
        >
          <Text>Đã tài khoản rồi? </Text>
          <Text className="font-bold underline">Đăng nhập ngay</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

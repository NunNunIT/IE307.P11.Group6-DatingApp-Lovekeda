import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextField } from "react-native-ui-lib";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/provider/AuthProvider";
import { supabase } from "@/supabase/supabase";
import { router, useNavigation } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import ImageUploadType1 from "@/components/imageUpload/type1";
import { Image } from "react-native";
import { Pen } from "@/lib/icons";

const { width } = Dimensions.get("window");

interface ProfileFormData {
  user_id?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  house_number: string;
  city: string;
  imgs: string[];
}

export default function ProfileForm() {
  const { colorScheme } = useColorScheme();
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    house_number: "",
    city: "",
    imgs: [],
  });
  const [isDirtyFields, setIsDirtyFields] = useState(false);

  const getProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session?.user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile(
        data || {
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          phone: "",
          house_number: "",
          city: "",
          imgs: [],
        }
      );
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile(null);
    }
  }, [session]);

  useEffect(() => {
    if (session) getProfile();
  }, [session, getProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        username: profile.username ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        house_number: profile.house_number ?? "",
        city: profile.city ?? "",
        imgs: profile.imgs ?? [],
      });
    }
  }, [profile]);

  useEffect(() => {
    const isDirty =
      JSON.stringify(formData) !==
      JSON.stringify({
        first_name: profile?.first_name,
        last_name: profile?.last_name,
        username: profile?.username,
        email: profile?.email,
        phone: profile?.phone,
        house_number: profile?.house_number,
        city: profile?.city,
        imgs: profile?.imgs,
      });
    setIsDirtyFields(isDirty);
  }, [formData, profile]);

  const updateField = useCallback(
    (field: keyof ProfileFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const submitHandler = async () => {
    if (!session) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const userData = {
        ...formData,
        user_id: session.user.id,
      };

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(userData, { onConflict: "user_id" });

      if (upsertError) {
        throw upsertError;
      }

      await getProfile(); // Reload profile data after submitting
      router.back(); // Go back to the previous screen
    } catch (err) {
      console.error("Error submitting data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTextFieldProps = (
    label: string,
    field: keyof ProfileFormData,
    options?: {
      keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
      validation?: ((value: string) => boolean)[]; // Custom validation functions
      validationMessages?: string[]; // Custom validation messages
    }
  ) => ({
    label,
    value: formData[field],
    onChangeText: (value: string) => updateField(field, value),
    keyboardType: options?.keyboardType || "default",
    validate: ["required", ...(options?.validation || [])],
    validationMessage: [
      "This field is required",
      ...(options?.validationMessages || []),
    ],
    maxLength: 30,
    containerStyle: { width: "100%" },
    fieldStyle: {
      backgroundColor: colorScheme === "dark" ? "#18181b" : "#f4f4f5",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: colorScheme === "dark" ? "#27272a" : "#e4e4e7",
    },
  });

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={submitHandler} variant="red">
          <Text>Save</Text>
        </Button>
      ),
    });
  }, [navigation, submitHandler]);

  return (
    <View className="flex-1">
      <Spinner visible={isSubmitting} />
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
        style={{ flex: 1 }}
      >
        <View style={{ flexGrow: 1, paddingBottom: 16 }}>
          <View className="flex flex-row gap-3">
            <TextField
              {...getTextFieldProps("First Name", "first_name")}
              containerStyle={{ width: "48%" }}
            />
            <TextField
              {...getTextFieldProps("Last Name", "last_name")}
              containerStyle={{ width: "48%" }}
            />
          </View>
          <TextField {...getTextFieldProps("Username", "username")} />

          <TextField
            {...getTextFieldProps("Email", "email", {
              keyboardType: "email-address",
              validation: [(value) => /\S+@\S+\.\S+/.test(value)],
              validationMessages: ["Invalid email address"],
            })}
          />
          <TextField
            {...getTextFieldProps("Phone", "phone", {
              keyboardType: "phone-pad",
              validation: [(value) => /^\d{10}$/.test(value)],
              validationMessages: ["Invalid phone number"],
            })}
          />
          <TextField {...getTextFieldProps("House Number", "house_number")} />
          <TextField {...getTextFieldProps("City", "city")} />
        </View>
      </ScrollView>
      {/* <Button
        onPress={submitHandler}
        className="m-4 rounded-full z-50"
        disabled={!isDirtyFields || isSubmitting}
        variant="red"
      >
        <Text>Lưu</Text>
      </Button> */}
    </View>
  );
}

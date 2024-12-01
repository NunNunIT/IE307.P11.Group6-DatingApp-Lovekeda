// Import libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Image, Keyboard, View } from "react-native";
import { z } from "zod";
import { useKeyboard } from "~/lib/keyboard";
import * as ImagePicker from "react-native-image-picker";
// Import components
import { Form, FormController } from "~/components/custom-ui/form";
import { Input } from "@/components/ui/input";
import * as SelectPrimitive from "@rn-primitives/select";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

// Define schema using zod
const schema = z.object({
  name: z.string().nonempty("Name is required"),
  bio: z.string().optional(),
  imgs: z.array(z.string().url()).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  target: z.enum(["friend", "love", "other"]).optional(),
  interest: z.string().optional(),
  address: z.string().optional(),
});

export default function LogicScreen() {
  const router = useRouter(); // Using router if needed for navigation
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      bio: "",
      imgs: [],
      gender: "male",
      target: "friend",
      interest: "",
      address: "",
    },
  });

  const { keyboardHeight } = useKeyboard();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
    });

    if (!result.didCancel && result.assets) {
      const newImgs = result.assets.map((asset) => asset.uri || "");
      form.setValue("imgs", [...form.getValues("imgs"), ...newImgs]);
    }
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("Form data submitted:", data);
  };

  return (
    <View style={{ paddingBottom: keyboardHeight, paddingHorizontal: 16 }}>
      <Form {...form}>
        {/* Name field */}
        <FormController
          name="name"
          label="Name:"
          render={({ field }) => (
            <Input
              autoCapitalize="none"
              placeholder="Enter your name"
              {...field}
            />
          )}
        />

        {/* Bio field */}
        <FormController
          name="bio"
          label="Bio:"
          render={({ field }) => (
            <Input
              autoCapitalize="none"
              placeholder="Enter your bio"
              {...field}
            />
          )}
        />

        {/* Images field */}
        <Text>Images:</Text>
        <Button onPress={pickImage}>
          <Text>Upload Images</Text>
        </Button>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          {form.watch("imgs").map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={{ width: 100, height: 100, marginRight: 8 }}
            />
          ))}
        </View>

        {/* Gender field */}
        <FormController
          name="gender"
          label="Gender:"
          render={({ field }) => (
            <SelectPrimitive.Root
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectPrimitive.Trigger>
                <SelectPrimitive.Value placeholder="Select a gender" />
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Portal>
                <SelectPrimitive.Overlay>
                  <SelectPrimitive.Content>
                    <SelectPrimitive.Viewport>
                      <SelectPrimitive.Item value="male">
                        <Text>Male</Text>
                      </SelectPrimitive.Item>
                      <SelectPrimitive.Item value="female">
                        <Text>Female</Text>
                      </SelectPrimitive.Item>
                      <SelectPrimitive.Item value="other">
                        <Text>Other</Text>
                      </SelectPrimitive.Item>
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Overlay>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          )}
        />

        {/* Target field */}
        <FormController
          name="target"
          label="Target:"
          render={({ field }) => (
            <SelectPrimitive.Root
              value={field.value}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectPrimitive.Trigger>
                <SelectPrimitive.Value placeholder="Select a target" />
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Portal>
                <SelectPrimitive.Overlay>
                  <SelectPrimitive.Content>
                    <SelectPrimitive.Viewport>
                      <SelectPrimitive.Item value="friend">
                        <Text>Friend</Text>
                      </SelectPrimitive.Item>
                      <SelectPrimitive.Item value="love">
                        <Text>Love</Text>
                      </SelectPrimitive.Item>
                      <SelectPrimitive.Item value="other">
                        <Text>Other</Text>
                      </SelectPrimitive.Item>
                    </SelectPrimitive.Viewport>
                  </SelectPrimitive.Content>
                </SelectPrimitive.Overlay>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          )}
        />

        {/* Interest field */}
        <FormController
          name="interest"
          label="Interest:"
          render={({ field }) => (
            <Input
              autoCapitalize="none"
              placeholder="Enter your interest"
              {...field}
            />
          )}
        />

        {/* Submit button */}
        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text>Submit</Text>
        </Button>

        {/* Debug: Display submitted data */}
        <View>
          {form.watch() && <Text>{JSON.stringify(form.watch(), null, 2)}</Text>}
        </View>
      </Form>
    </View>
  );
}

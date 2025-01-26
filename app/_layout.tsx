import "~/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { DumpProvider } from "@/providers/DumpProvider";

export { ErrorBoundary} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <DumpProvider>
      <GestureHandlerRootView className="flex flex-1">
        <ThemeProvider>
          <AuthProvider>
            <Slot />
            <PortalHost />
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </DumpProvider>
  );
}

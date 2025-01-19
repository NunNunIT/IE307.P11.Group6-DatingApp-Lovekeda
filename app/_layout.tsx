import "~/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Slot, SplashScreen } from "expo-router";
import * as React from "react";
import { AppState, Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider } from "~/provider/ThemeProvider";
import { AuthProvider } from "@/provider/AuthProvider";
import { DumpProvider } from "@/provider/DumpProvider";

export { ErrorBoundary} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <DumpProvider>
      <GestureHandlerRootView className="flex flex-1">
        <ThemeProvider>
          <AuthProvider>
            {/* <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} /> */}
            <Slot />
            <PortalHost />
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </DumpProvider>
  );
}

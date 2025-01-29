import { ReactNode } from "react";
import { AppState, AppStateStatus } from "react-native";
import { SWRConfig } from "swr";

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => true,
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          const subscription = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          return () => subscription.remove();
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

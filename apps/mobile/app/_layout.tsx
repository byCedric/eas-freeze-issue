import * as React from 'react';
import { StatusBar } from "expo-status-bar";
import { Stack, router } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as ReactNavigationThemeProvider,
} from "@react-navigation/native";
import { ThemeColors } from "~/constants/colors";
import {
  useTheme,
  useAutoSetAppearanceFromSettingsEffect,
} from "~/components/Themed";
import { useDataIsReady } from "~/storage/PourStore";
import * as QuickActions from "expo-quick-actions";

// import * as Sentry from "@sentry/react-native";

function Root() {
  useAutoSetAppearanceFromSettingsEffect();
  const theme = useTheme();
  const dataIsReady = useDataIsReady();

  if (!dataIsReady) {
    return null;
  }

  useQuickActionCallback((action) => {
    if (action.id === "1") {
      requestAnimationFrame(() => {
        router.push("/new");
      });
    }
  });

  return (
    <>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <ReactNavigationThemeProvider
        value={
          theme === "dark"
            ? CustomNavigationDarkTheme
            : CustomNavigationLightTheme
        }
      >
        <Stack screenOptions={{ presentation: "modal" }} />
      </ReactNavigationThemeProvider>
    </>
  );
}

const CustomNavigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#000",
  },
};

const CustomNavigationDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: ThemeColors.dark.tint,
    text: "#fff",
    notification: "#fff",
  },
};

export default Root;
// export default Sentry.wrap(Root);

function useQuickActionCallback(
  callback?: (data: QuickActions.Action) => void | Promise<void>
) {
  React.useEffect(() => {
    let isMounted = true;

    if (QuickActions.initial) {
      callback?.(QuickActions.initial);
    }

    const sub = QuickActions.addListener((event) => {
      if (isMounted) {
        callback?.(event);
      }
    });
    return () => {
      isMounted = false;
      sub.remove();
    };
  }, [QuickActions.initial, callback]);
}
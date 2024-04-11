import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { RootSiblingParent } from "react-native-root-siblings";

import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { NativeProvider } from "@/hooks/useNative";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = { initialRouteName: "(onboarding)/index" };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FontAwesome.font });

  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <NativeProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="auto" />
          <RootSiblingParent>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </RootSiblingParent>
        </ThemeProvider>
      </NativeProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack
      initialRouteName={isAuthenticated ? "(app)" : "(onboarding)/first"}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

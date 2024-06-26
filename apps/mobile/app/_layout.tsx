import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { NativeProvider } from "@/hooks/useNative";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(onboarding)/index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <NativeProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto" />
            <AuthProvider>
              <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
                <RootLayoutNav />
              </StripeProvider>
            </AuthProvider>
          </ThemeProvider>
        </NativeProvider>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  return (
    <Stack
      initialRouteName={isAuthenticated ? "(app)/home" : "(onboarding)/first"}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

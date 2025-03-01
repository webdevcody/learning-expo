import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href="/feed" />;

  return (
    <Stack
      screenOptions={{
        ...(process.env.EXPO_OS !== "ios"
          ? {}
          : {
              headerLargeTitle: true,
              headerTransparent: true,
              headerBlurEffect: "systemChromeMaterial",
              headerLargeTitleShadowVisible: false,
              headerShadowVisible: true,
              headerLargeStyle: {
                backgroundColor: "transparent",
              },
            }),
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen
        name="login"
        options={{
          presentation: "card",
          headerTitle: "Login",
        }}
      />

      <Stack.Screen
        name="sign-up"
        options={{
          presentation: "card",
          headerTitle: "Sign up",
        }}
      />

      <Stack.Screen
        name="reset-password"
        options={{ headerTitle: "Reset password", presentation: "modal" }}
      />
    </Stack>
  );
}

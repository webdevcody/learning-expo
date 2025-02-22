import Stack from "@/components/ui/Stack";
import { Text, useColorScheme, View } from "react-native";

export default function Layout() {
  const theme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        title: "My App",
        headerStyle: {
          backgroundColor: theme === "dark" ? "#111" : "#333",
        },
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen
        name="post"
        options={{
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="account"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

import Stack from "@/components/ui/Stack";
import { useColorScheme } from "react-native";
import * as Form from "@/components/ui/Form";

export default function Layout({ segment }: { segment: string }) {
  const theme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        title: "My App",
        headerLeft: () => null,
        headerStyle: {
          backgroundColor: theme === "dark" ? "#111" : "#333",
        },
      }}
    >
      <Stack.Screen options={{}} name="index" />

      <Stack.Screen
        name="post"
        options={{
          title: "",
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

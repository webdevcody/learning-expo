import Stack from "@/components/ui/Stack";
import { Button, useColorScheme } from "react-native";
import * as Form from "@/components/ui/Form";
import { useRouter } from "expo-router";

export default function Layout({ segment }: { segment: string }) {
  const theme = useColorScheme();
  const router = useRouter();

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
          headerLeft: () => (
            <Button
              title="Cancel"
              onPress={() => {
                router.back();
              }}
            ></Button>
          ),
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

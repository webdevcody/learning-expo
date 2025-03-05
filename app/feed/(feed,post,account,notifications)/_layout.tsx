import Stack from "@/components/ui/Stack";
import { Button, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

export default function Layout({ segment }: { segment: string }) {
  const theme = useColorScheme();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Your Feed",
        }}
        name="index"
      />

      <Stack.Screen
        name="post"
        options={{
          title: "",
          presentation: "modal",
          headerTitle: "New Post",
          headerLargeTitle: false,
          headerLeft: () => (
            <Button
              title="Cancel"
              color={theme === "dark" ? "#EEE" : "#111"}
              onPress={() => router.back()}
            />
          ),
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          presentation: "modal",
          headerTitle: "Notifications",
          headerLargeTitle: false,
          headerLeft: () => (
            <Button
              title="Close"
              color={theme === "dark" ? "#EEE" : "#111"}
              onPress={() => router.back()}
            />
          ),
        }}
      />

      <Stack.Screen
        name="profile/[userId]"
        options={{
          presentation: "card",
          headerTitle: "",
        }}
      />

      <Stack.Screen name="account" />
    </Stack>
  );
}

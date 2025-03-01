import Stack from "@/components/ui/Stack";
import { Button, Pressable, Text, useColorScheme, View } from "react-native";
import * as Form from "@/components/ui/Form";
import { Link, useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

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

      <Stack.Screen name="account" />
    </Stack>
  );
}

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
          headerTitle: "Feed",
          // headerLeft: () => (
          //   <IconSymbol name="bird.circle.fill" size={24} color="purple" />
          // ),
          // headerRight: () => (
          //   <IconSymbol name="bird.circle.fill" size={24} color="purple" />
          // ),

          // header: () => (
          //   <View
          //     style={{
          //       justifyContent: "center",
          //       alignItems: "center",
          //       paddingVertical: 44,
          //       backgroundColor: theme === "dark" ? "#333" : "#ddd",
          //     }}
          //   >
          //     <IconSymbol name="bird.circle.fill" size={24} color="purple" />
          //   </View>
          // ),
        }}
        name="index"
      />

      <Stack.Screen
        name="post"
        options={{
          title: "",
          presentation: "modal",
          headerLeft: () => (
            <Button title="Cancel" color="#000" onPress={() => router.back()} />
          ),
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          presentation: "modal",
          headerTitle: "Notifications",
        }}
      />

      <Stack.Screen name="account" />
    </Stack>
  );
}

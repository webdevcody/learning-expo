import Stack from "@/components/ui/Stack";
import { Text, View } from "react-native";

import * as Form from "@/components/ui/Form";

export const unstable_settings = {
  index: {
    initialRouteName: "index test",
  },
  info: {
    initialRouteName: "info",
  },
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        title: "My App",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => (
            <Form.Link headerRight href="/account">
              <Avatar />
            </Form.Link>
          ),
        }}
      />

      <Stack.Screen
        name="account"
        options={{
          presentation: "modal",

          headerRight: () => (
            <Form.Link headerRight bold href="/" dismissTo>
              Done
            </Form.Link>
          ),
        }}
      />
    </Stack>
  );
}

function Avatar() {
  return (
    <View
      style={{
        padding: 6,
        borderRadius: 99,
        [process.env.EXPO_OS === "web"
          ? `backgroundImage`
          : `experimental_backgroundImage`]: `linear-gradient(to bottom, #A5ABB8, #858994)`,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: process.env.EXPO_OS === "ios" ? "ui-rounded" : undefined,
          fontSize: 14,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        EB
      </Text>
    </View>
  );
}

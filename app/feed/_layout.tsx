import Tabs from "@/components/ui/Tabs";
import { useColorScheme } from "react-native";

export default function Layout() {
  return <AppTabs />;
}

function AppTabs() {
  const theme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme === "dark" ? "#111" : "#EEE",
        },
      }}
    >
      <Tabs.Screen
        name="(feed)"
        systemImage="house.fill"
        title="Feed"
        options={{
          href: "/feed",
        }}
      />

      <Tabs.Screen
        name="(post)"
        systemImage="plus.app.fill"
        title="New Post"
        options={{
          href: "/feed/post",
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        systemImage="bell.fill"
        title="Notifications"
        options={{
          href: "/feed/notifications",
        }}
      />

      <Tabs.Screen
        name="(account)"
        systemImage="person.circle.fill"
        title="Account"
        options={{
          href: "/feed/account",
        }}
      />
    </Tabs>
  );
}

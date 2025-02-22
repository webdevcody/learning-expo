import ThemeProvider from "@/components/ui/ThemeProvider";
import Tabs from "@/components/ui/Tabs";
import { useColorScheme } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <AppTabs />
    </ThemeProvider>
  );
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
      <Tabs.Screen name="(index)" systemImage="house.fill" title="Home" />
      <Tabs.Screen
        name="(post)"
        systemImage="plus.app.fill"
        title="New Post"
        options={{
          href: "/post",
        }}
      />
    </Tabs>
  );
}

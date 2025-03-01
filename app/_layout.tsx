import ThemeProvider from "@/components/ui/ThemeProvider";
import Tabs from "@/components/ui/Tabs";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppTabs />
      </ThemeProvider>
    </QueryClientProvider>
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

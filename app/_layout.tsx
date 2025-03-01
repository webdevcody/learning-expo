import ThemeProvider from "@/components/ui/ThemeProvider";
import Tabs from "@/components/ui/Tabs";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppTabs />
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkLoaded>
    </ClerkProvider>
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
      <Tabs.Screen
        name="(account)"
        systemImage="person.circle.fill"
        title="Account"
      />
    </Tabs>
  );
}

import { View, StyleSheet, Image, useColorScheme } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { useGlobalSearchParams } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

export default function ProfileScreen() {
  const glob = useGlobalSearchParams();

  const theme = useColorScheme();
  const api = useApi();
  const userId = glob.userId as string;
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${userId}`;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => api.profiles.get(userId),
  });

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!profile) {
    return <ThemedText>Profile not found</ThemedText>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: defaultProfilePicture }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <ThemedText style={styles.username}>
            {profile?.displayName}
          </ThemedText>
          <ThemedText
            style={[
              styles.handle,
              { color: theme === "dark" ? "#AAA" : "#333" },
            ]}
          >
            {profile.handle}
          </ThemedText>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>123</ThemedText>
          <ThemedText style={styles.statLabel}>Posts</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>1.4K</ThemedText>
          <ThemedText style={styles.statLabel}>Followers</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>892</ThemedText>
          <ThemedText style={styles.statLabel}>Following</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  handle: {
    fontSize: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 0.5,
    borderTopColor: "#BBB",
    paddingTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
});

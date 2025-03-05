import {
  View,
  StyleSheet,
  Image,
  useColorScheme,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { useGlobalSearchParams } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { GetPostsResponse } from "@/app/api/posts+api";
import { formatDistanceToNow } from "date-fns";

export default function ProfileScreen() {
  const glob = useGlobalSearchParams();

  const theme = useColorScheme();
  const api = useApi();
  const userId = glob.userId as string;
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${userId}`;

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => api.profiles.get(userId),
  });

  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => api.profiles.getPosts(userId),
  });

  if (isLoadingProfile || isLoadingPosts) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!profile) {
    return <ThemedText>Profile not found</ThemedText>;
  }

  const renderPost = ({ item }: { item: GetPostsResponse[0] }) => (
    <View style={styles.postContainer}>
      <ThemedText style={styles.postContent}>{item.content}</ThemedText>
      <ThemedText style={styles.postDate}>
        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
      </ThemedText>
    </View>
  );

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
          <ThemedText style={styles.statNumber}>
            {userPosts?.length || 0}
          </ThemedText>
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

      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postsList}
      />
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
  postsList: {
    marginTop: 20,
  },
  postContainer: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#BBB",
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    opacity: 0.7,
  },
});

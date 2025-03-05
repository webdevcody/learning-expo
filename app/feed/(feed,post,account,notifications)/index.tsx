import { BodyScrollView } from "@/components/ui/BodyScrollView";
import {
  StyleSheet,
  View,
  Image,
  useColorScheme,
  RefreshControl,
  Pressable,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ThemedText } from "@/components/ui/ThemedText";
import Skeleton from "@/components/ui/Skeleton";
import { useApi } from "@/hooks/useApi";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { GetPostsResponse } from "@/app/api/posts+api";

function PostComponent(post: GetPostsResponse[number]) {
  const theme = useColorScheme();
  const router = useRouter();
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${post.content}`; // Using text as seed for variety

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const handleProfilePress = () => {
    router.push({
      pathname: "/feed/profile/[userId]",
      params: {
        userId: post.userId,
      },
    });
  };

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Pressable onPress={handleProfilePress}>
          <Image
            source={{ uri: defaultProfilePicture }}
            style={styles.avatar}
          />
        </Pressable>
        <Pressable onPress={handleProfilePress} style={{ flex: 1 }}>
          <View
            style={{
              gap: 4,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <ThemedText>{post.profile.displayName}</ThemedText>
              <ThemedText
                style={{
                  color: theme === "dark" ? "#AAA" : "#333",
                }}
              >
                @{post.profile.handle}
              </ThemedText>
            </View>
            <ThemedText
              style={{
                fontSize: 14,
                color: theme === "dark" ? "#EEE" : "#666",
              }}
            >
              {timeAgo}
            </ThemedText>
          </View>
        </Pressable>
      </View>

      <ThemedText style={styles.postText}>{post.content}</ThemedText>
    </View>
  );
}

export default function Page() {
  const api = useApi();
  const queryClient = useQueryClient();

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }

  let {
    data: posts,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.posts.get(),
  });

  if (isLoading) {
    return (
      <BodyScrollView>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.post}>
            <View style={styles.postHeader}>
              <Skeleton style={[styles.avatar]} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton />
                <Skeleton />
              </View>
            </View>
            <Skeleton />
          </View>
        ))}
      </BodyScrollView>
    );
  }

  return (
    <BodyScrollView
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
    >
      {posts?.map((post: GetPostsResponse[number]) => (
        <PostComponent key={post.id} {...post} />
      ))}
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  post: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#BBB",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "gray",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
  },
  handle: {
    fontSize: 15,
    color: "#888888", // Light gray for secondary text
    marginTop: 2,
  },
  postText: {
    fontSize: 17,
    marginBottom: 12,
    lineHeight: 22,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 72,
    marginTop: 4,
  },
});

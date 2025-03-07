import React from "react";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import {
  StyleSheet,
  View,
  Image,
  useColorScheme,
  RefreshControl,
  Pressable,
} from "react-native";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ThemedText } from "@/components/ui/ThemedText";
import Skeleton from "@/components/ui/Skeleton";
import { useApi } from "@/hooks/useApi";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "expo-router";
import { GetPostsResponse } from "@/app/api/posts+api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { Profile } from "@/db/schema";

function PostComponent(post: GetPostsResponse[number]) {
  const theme = useColorScheme();
  const router = useRouter();
  const api = useApi();
  const queryClient = useQueryClient();
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${post.userId}`; // Using text as seed for variety

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

  const { userId } = useAuth();

  const toggleLikeMutation = useMutation({
    mutationFn: () => api.posts.toggleLike(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
    },
  });

  const handleLikePress = () => {
    toggleLikeMutation.mutate();
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

      {post.imageKey && (
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `${process.env.EXPO_PUBLIC_FILE_HOST_BASE_URL}/${post.imageKey}`,
            }}
            style={styles.postImage}
          />
        </View>
      )}

      <View style={styles.postActions}>
        <Pressable
          onPress={handleLikePress}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={24}
            color={
              post.isLiked ? "#E91E63" : theme === "dark" ? "#FFF" : "#000"
            }
          />
          {post.likeCount > 0 && (
            <ThemedText style={styles.actionText}>{post.likeCount}</ThemedText>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function Page() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const theme = useColorScheme();

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: api.userProfile.get,
    enabled: !!userId,
  });

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    }
  }

  let {
    data: posts,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.posts.get(),
  });

  const defaultProfilePicture = userId
    ? `https://api.dicebear.com/7.x/bottts/png?seed=${userId}`
    : undefined;

  if (isLoading) {
    return (
      <BodyScrollView>
        <View style={styles.userInfo}>
          <Skeleton style={styles.userAvatar} />
          <View style={styles.userTextContainer}>
            <Skeleton style={{ width: 150, height: 24 }} />
            <Skeleton style={{ width: 100, height: 20, marginTop: 4 }} />
          </View>
        </View>
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
      {posts?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No posts yet. Be the first to share something!
          </ThemedText>
        </View>
      ) : (
        posts?.map((post: GetPostsResponse[number]) => (
          <PostComponent key={post.id} {...post} />
        ))
      )}
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
    alignItems: "center",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 4,
  },
  actionText: {
    fontSize: 14,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#BBB",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: "gray",
  },
  userTextContainer: {
    flex: 1,
  },
  userDisplayName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userHandle: {
    fontSize: 16,
    color: "#888888",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
});

import {
  View,
  StyleSheet,
  Image,
  useColorScheme,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { useGlobalSearchParams } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPostsResponse } from "@/app/api/posts+api";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/clerk-expo";
import Skeleton from "@/components/ui/Skeleton";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ProfileScreen() {
  const glob = useGlobalSearchParams();
  const queryClient = useQueryClient();
  const theme = useColorScheme();
  const api = useApi();
  const userId = glob.userId as string;
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${userId}`;
  const { userId: currentUserId } = useAuth();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => api.profiles.get(userId),
  });

  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => api.profiles.getPosts(userId),
  });

  const { data: followStatus, isLoading: isLoadingFollowStatus } = useQuery({
    queryKey: ["followStatus", userId],
    queryFn: () => api.profiles.getFollowStatus(userId),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["userStats", userId],
    queryFn: () => api.profiles.getStats(userId),
  });

  const handleFollowToggle = async () => {
    try {
      await api.profiles.toggleFollow(userId);
      queryClient.invalidateQueries({ queryKey: ["followStatus", userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats", userId] });
    } catch (error) {
      console.error("Failed to toggle follow status:", error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await api.posts.delete(postId);
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setSelectedPostId(null);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const renderPost = ({ item }: { item: GetPostsResponse[0] }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <ThemedText style={styles.postContent}>{item.content}</ThemedText>
        {currentUserId === userId && (
          <TouchableOpacity
            onPress={() =>
              setSelectedPostId(selectedPostId === item.id ? null : item.id)
            }
            style={styles.menuButton}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={theme === "dark" ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        )}
      </View>
      {selectedPostId === item.id && currentUserId === userId && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => handleDeletePost(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#E91E63" />
            <ThemedText style={styles.deleteText}>Delete Post</ThemedText>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.postFooter}>
        <ThemedText style={styles.postDate}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </ThemedText>
        <TouchableOpacity
          onPress={() => handleLikeToggle(item.id)}
          style={styles.likeButton}
        >
          <Ionicons
            name={item.isLiked ? "heart" : "heart-outline"}
            size={20}
            color={
              item.isLiked ? "#E91E63" : theme === "dark" ? "#FFF" : "#000"
            }
          />
          {item.likeCount > 0 && (
            <ThemedText style={styles.likeCount}>{item.likeCount}</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleLikeToggle = async (postId: number) => {
    try {
      await api.posts.toggleLike(postId);
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: defaultProfilePicture }} style={styles.avatar} />
        <View style={styles.userInfo}>
          {isLoadingProfile ? (
            <Skeleton style={styles.textLoader} />
          ) : (
            <ThemedText style={styles.username}>
              {profile?.displayName}
            </ThemedText>
          )}
          {currentUserId !== userId && (
            <TouchableOpacity
              style={[
                styles.followButton,
                followStatus?.following ? styles.followingButton : null,
              ]}
              onPress={handleFollowToggle}
            >
              <ThemedText style={styles.followButtonText}>
                {followStatus?.following ? "Following" : "Follow"}
              </ThemedText>
            </TouchableOpacity>
          )}
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
          <ThemedText style={styles.statNumber}>
            {stats?.followerCount || 0}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Followers</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {stats?.followingCount || 0}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Following</ThemedText>
        </View>
      </View>

      {isLoadingPosts ? (
        <View style={styles.postLoadingContainer}>
          {new Array(10).fill(0).map((_, index) => (
            <Skeleton key={index} style={styles.postLoader} />
          ))}
        </View>
      ) : (
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          style={styles.postsList}
        />
      )}
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
  textLoader: {
    height: 24,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  handle: {
    fontSize: 16,
  },
  postLoadingContainer: {
    gap: 24,
    paddingTop: 24,
  },
  postLoader: {
    height: 64,
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
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  followButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  followingButton: {
    backgroundColor: "#666",
  },
  followButtonText: {
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likeCount: {
    fontSize: 14,
    opacity: 0.8,
  },
  menuButton: {
    padding: 8,
  },
  dropdown: {
    position: "absolute",
    right: 16,
    top: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
  },
  deleteText: {
    color: "#E91E63",
  },
});

import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { StyleSheet, View, Image, useColorScheme } from "react-native";
import { getPosts } from "@/api/posts";
import { useQuery } from "@tanstack/react-query";
import { ThemedText } from "@/components/ui/ThemedText";
import { Post } from "@/db/schema";

function PostComponent(post: Post) {
  const theme = useColorScheme();
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${post.content}`; // Using text as seed for variety

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={{ uri: defaultProfilePicture }} style={styles.avatar} />
        <View
          style={{
            flex: 1,
            gap: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ThemedText>Random User</ThemedText>
          <ThemedText
            style={{
              color: theme === "dark" ? "#AAA" : "#333",
            }}
          >
            @random_user
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 14,
              color: theme === "dark" ? "#EEE" : "#666",
            }}
          >
            - 1h
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.postText}>{post.content}</ThemedText>

      {/* {post.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.image }}
            style={styles.postImage}
          />
        </View>
      )} */}
    </View>
  );
}

export default function Page() {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  return (
    <BodyScrollView>
      {posts?.map((post: Post) => (
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

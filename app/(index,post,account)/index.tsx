import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { StyleSheet, View, Image } from "react-native";
import * as Form from "@/components/ui/Form";
import { getPosts } from "@/api/posts";
import { useQuery } from "@tanstack/react-query";

type Post = {
  id: string;
  text: string;
  imageUrl?: string;
};

function Post({ text, imageUrl }: Post) {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <View style={styles.avatar} />
        <View>
          <Form.Text>User Name</Form.Text>
          <Form.Text>@username</Form.Text>
        </View>
      </View>

      <Form.Text style={styles.postText}>{text}</Form.Text>

      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.postImage} />
        </View>
      )}

      {/* <View style={styles.postActions}>
        <IconSymbol name="bubble.left" color={AC.secondaryLabel} />
        <IconSymbol name="arrow.rectanglepath" color={AC.secondaryLabel} />
        <IconSymbol name="heart" color={AC.secondaryLabel} />
        <IconSymbol name="square.and.arrow.up" color={AC.secondaryLabel} />
      </View> */}
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
        <Post key={post.id} {...post} />
      ))}
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  post: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#444",
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

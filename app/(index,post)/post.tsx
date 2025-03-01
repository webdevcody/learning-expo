import { router } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/posts";
import { NewPost } from "@/db/schema";
import { TextArea } from "@/components/ui/TextArea";

export default function NewPostScreen() {
  const [postContent, setPostContent] = useState("");

  const createPostMutation = useMutation({
    mutationFn: (data: NewPost) => createPost(data),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
  });

  async function handleSubmit() {
    await createPostMutation.mutate({
      title: "test",
      content: postContent,
    });
  }

  return (
    <View style={styles.container}>
      <TextArea value={postContent} onChangeText={setPostContent} />
      <Button onPress={handleSubmit} title="Submit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 48,
  },
  textArea: {
    width: "100%",
  },
});

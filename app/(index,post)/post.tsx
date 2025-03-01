import { router } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, View } from "react-native";
import * as Form from "@/components/ui/Form";
import { TextArea } from "@/components/ui/TextArea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createPost, getPosts } from "@/api/posts";
import { NewPost } from "@/db/schema";

export default function NewPostScreen() {
  const [postContent, setPostContent] = useState("");

  const createPostMutation = useMutation({
    mutationFn: (data: NewPost) => createPost(data),
  });

  async function handleSubmit() {
    await createPostMutation.mutateAsync({
      title: "test",
      content: postContent,
    });
    router.back();
  }

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: 10,
          marginRight: 10,
          padding: 10,
        }}
      >
        <Form.Link href="/">Cancel</Form.Link>
        <Button title="Post" onPress={handleSubmit} />
      </View>

      <TextArea value={postContent} onChangeText={setPostContent} />
    </ScrollView>
  );
}

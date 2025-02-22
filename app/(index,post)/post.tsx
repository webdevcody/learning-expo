import { Link, Stack, router } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, TextInput, View } from "react-native";
import * as Form from "@/components/ui/Form";
import { TextArea } from "@/components/ui/TextArea";

export default function NewPostScreen() {
  const [postContent, setPostContent] = useState("");

  const handleSubmit = () => {
    console.log("Submitted:", postContent);
    router.back();
  };

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

import { router } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewPost } from "@/db/schema";
import { TextArea } from "@/components/ui/TextArea";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";

const postSchema = z.object({
  content: z.string().min(1, "Post content is required"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function NewPostScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const queryClient = useQueryClient();
  const api = useApi();

  const createPostMutation = useMutation({
    mutationFn: api.posts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
  });

  const onSubmit = handleSubmit((data) => {
    createPostMutation.mutate({
      content: data.content,
    });
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="content"
        render={({ field: { value, onChange } }) => (
          <View style={styles.inputContainer}>
            <TextArea
              value={value}
              onChangeText={onChange}
              style={[styles.textArea, errors.content && styles.errorInput]}
              editable={!createPostMutation.isPending}
            />
            {errors.content && (
              <Text style={styles.errorText}>{errors.content.message}</Text>
            )}
          </View>
        )}
      />
      <Button
        onPress={onSubmit}
        title={createPostMutation.isPending ? "Posting..." : "Submit"}
        disabled={createPostMutation.isPending}
      />
      {createPostMutation.isPending && (
        <ActivityIndicator style={styles.spinner} />
      )}
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
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  textArea: {
    width: "100%",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  spinner: {
    marginTop: 10,
  },
});

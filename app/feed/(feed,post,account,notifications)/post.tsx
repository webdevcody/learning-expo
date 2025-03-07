import { router } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextArea } from "@/components/ui/TextArea";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApi } from "@/hooks/useApi";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useState } from "react";

const postSchema = z.object({
  content: z.string().min(1, "Post content is required"),
});

type PostFormData = z.infer<typeof postSchema>;

export default function NewPostScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (selectedImage) {
        setIsUploading(true);
        // Get the presigned URL and fields
        const presignedPost = await api.files.createPresignedUrl();

        // Create form data for the upload
        const formData = new FormData();
        Object.entries(presignedPost.fields).forEach(([key, value]) => {
          formData.append(key, value);
        });

        // Add the file with proper metadata
        formData.append("file", {
          uri: selectedImage,
          type: "image/jpeg",
          name: "upload.jpg",
        } as any);

        // Upload to S3
        const uploadResponse = await fetch(presignedPost.url, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        // Create post with image
        createPostMutation.mutate({
          content: data.content,
          imageKey: presignedPost.fields.key,
        });
      } else {
        // Create post without image
        createPostMutation.mutate({
          content: data.content,
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsUploading(false);
    }
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
              editable={!createPostMutation.isPending && !isUploading}
            />
            {errors.content && (
              <Text style={styles.errorText}>{errors.content.message}</Text>
            )}
          </View>
        )}
      />

      <View style={styles.imageUploadContainer}>
        <ImageUpload onImageSelect={setSelectedImage} />
      </View>

      <Button
        onPress={onSubmit}
        title={
          isUploading
            ? "Uploading..."
            : createPostMutation.isPending
            ? "Posting..."
            : "Submit"
        }
        disabled={createPostMutation.isPending || isUploading}
      />
      {(createPostMutation.isPending || isUploading) && (
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
  imageUploadContainer: {
    width: "100%",
    marginBottom: 16,
    alignItems: "center",
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

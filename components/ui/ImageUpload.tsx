import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

interface ImageUploadProps {
  onUploadComplete?: (url: string) => void;
  getPresignedUrl: () => Promise<{
    url: string;
    fields: Record<string, string>;
  }>;
}

export function ImageUpload({
  onUploadComplete,
  getPresignedUrl,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    try {
      setIsUploading(true);

      // Get the presigned URL and fields
      const presignedPost = await getPresignedUrl();

      // Create form data for the upload
      const formData = new FormData();
      Object.entries(presignedPost.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add the file with proper metadata
      formData.append("file", {
        uri: image,
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

      console.log("uploadResponse", uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      // Calculate the final URL
      const uploadedUrl = `${presignedPost.url}/${presignedPost.fields.key}`;
      onUploadComplete?.(uploadedUrl);

      // Clear the selected image
      setImage(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
            <ThemedText style={styles.placeholderText}>Select Image</ThemedText>
          </View>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity
          onPress={uploadImage}
          style={[
            styles.uploadButton,
            isUploading && styles.uploadButtonDisabled,
          ]}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.uploadButtonText}>Post Image</ThemedText>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  pickButton: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

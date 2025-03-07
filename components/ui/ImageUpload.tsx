import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";

interface ImageUploadProps {
  onImageSelect?: (uri: string | null) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      onImageSelect?.(selectedImage);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
          <View style={styles.placeholder}>
            <ThemedText style={styles.placeholderText}>Add an image</ThemedText>
            <MaterialIcons name="add-photo-alternate" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  imageContainer: {
    width: 320,
    height: 200,
    borderRadius: 8,
  },
  pickButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    color: "#666",
  },
});

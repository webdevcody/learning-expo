import { Button, StyleSheet, ActivityIndicator, View } from "react-native";
import * as Form from "@/components/ui/Form";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import TextInput from "@/components/ui/TextInput";
import { useApi } from "@/hooks/useApi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ThemedText } from "@/components/ui/ThemedText";
import { Profile } from "@/db/schema";

export default function AccountScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const api = useApi();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState("");

  const { data: userProfile } = useQuery<Profile>({
    queryKey: ["userProfile"],
    queryFn: api.userProfile.get,
  });

  // Update display name when profile is fetched
  useEffect(() => {
    if (userProfile?.displayName || user?.firstName) {
      setDisplayName(userProfile?.displayName || user?.firstName || "");
    }
  }, [userProfile?.displayName, user?.firstName]);

  const {
    mutate: updateProfile,
    isPending,
    error: mutationError,
  } = useMutation({
    mutationFn: async (newDisplayName: string) => {
      if (!newDisplayName || newDisplayName.trim().length < 4) {
        throw new Error("Display name must be at least 4 characters long");
      }

      const trimmedName = newDisplayName.trim();

      // Update in our database
      return api.userProfile.update({
        displayName: trimmedName,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch userProfile query
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const handleDisplayNameChange = (text: string) => {
    setDisplayName(text);
  };

  return (
    <Form.List navigationTitle="Settings">
      <Form.Section title="Profile">
        <TextInput
          label="Display Name"
          value={displayName}
          containerStyle={styles.inputContainer}
          onChangeText={handleDisplayNameChange}
        />
        {mutationError && (
          <ThemedText style={styles.errorText}>
            {mutationError instanceof Error
              ? mutationError.message
              : "An error occurred"}
          </ThemedText>
        )}
        <View style={styles.buttonContainer}>
          <Button
            title={isPending ? "Updating..." : "Update Profile"}
            onPress={() => updateProfile(displayName)}
            disabled={isPending}
          />
          {isPending && (
            <ActivityIndicator style={styles.loader} color="#007AFF" />
          )}
        </View>
      </Form.Section>

      <Form.Section title="Security">
        <Button
          title="Sign out"
          onPress={async () => {
            await signOut();
            router.push("/");
          }}
        />
      </Form.Section>
    </Form.List>
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
    marginBottom: 8,
    width: "100%",
  },
  actionContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
  },
  loader: {
    marginLeft: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
});

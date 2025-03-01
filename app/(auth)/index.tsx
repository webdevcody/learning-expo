import { StyleSheet, View } from "react-native";
import Button from "@/components/ui/Button";
import { useAuth } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";

export default function IndexScreen() {
  const { signOut, isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/feed" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">SocialApp</ThemedText>
      <ThemedText>Connect with friends and share moments</ThemedText>

      <View style={styles.buttonContainer}>
        <Link href="/(auth)/sign-up" asChild>
          <Button style={styles.button}>Sign Up</Button>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Button style={styles.button}>Log In</Button>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginTop: 24,
  },
  button: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
});

import { Button, StyleSheet } from "react-native";
import * as Form from "@/components/ui/Form";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function AccountScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <Form.List navigationTitle="Settings">
      <Form.Section title="Security">
        <Button
          title="Sign out"
          onPress={async () => {
            await signOut();
            router.push("/");
          }}
        ></Button>
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
});

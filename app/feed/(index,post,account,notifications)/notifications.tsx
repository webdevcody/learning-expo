import { StyleSheet, View } from "react-native";

export default function NotificationsScreen() {
  return <View style={styles.container}></View>;
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

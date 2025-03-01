import { Colors } from "@/constants/Colors";
import { TextInput, useColorScheme, View } from "react-native";

export function TextArea({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  const theme = useColorScheme();

  return (
    <TextInput
      multiline
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoFocus
      style={{
        padding: 10,
        margin: 10,
        height: 120,
        borderWidth: 1,
        width: "100%",
        backgroundColor: theme === "dark" ? "#111" : "#EEE",
        borderColor: theme === "dark" ? "#444" : "#ccc",
        borderRadius: 5,
        color: theme === "dark" ? "#EEE" : "#111",
      }}
    />
  );
}

import { StyleProp, TextInput, TextStyle, useColorScheme } from "react-native";

export function TextArea({
  value,
  onChangeText,
  style,
  placeholder,
  editable = true,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  editable?: boolean;
}) {
  const theme = useColorScheme();

  return (
    <TextInput
      multiline
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={editable}
      style={{
        padding: 10,
        height: 120,
        borderWidth: 1,
        width: "100%",
        backgroundColor: theme === "dark" ? "#111" : "#EEE",
        borderColor: theme === "dark" ? "#444" : "#ccc",
        borderRadius: 5,
        color: theme === "dark" ? "#EEE" : "#111",
        ...(style as TextStyle),
      }}
    />
  );
}

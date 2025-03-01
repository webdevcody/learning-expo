import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { StyleSheet, View, Text, Image, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";

type NotificationType = "like" | "follow" | "post";

interface NotificationProps {
  type: NotificationType;
  username: string;
  timestamp: string;
  postText?: string;
}

function Notification({
  type,
  username,
  timestamp,
  postText,
}: NotificationProps) {
  const theme = useColorScheme();

  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${username}`;

  const renderIcon = () => {
    switch (type) {
      case "like":
        return <Ionicons name="heart" size={24} color="#FF4B4B" />;
      case "follow":
        return <Ionicons name="person-add" size={24} color="#007AFF" />;
      case "post":
        return (
          <Image
            source={{ uri: defaultProfilePicture }}
            style={styles.profilePicture}
          />
        );
    }
  };

  const renderContent = () => {
    switch (type) {
      case "like":
        return (
          <Text
            style={[styles.text, { color: theme === "dark" ? "#EEE" : "#111" }]}
          >
            <Text style={styles.username}>{username}</Text> liked your post
          </Text>
        );
      case "follow":
        return (
          <Text
            style={[styles.text, { color: theme === "dark" ? "#EEE" : "#111" }]}
          >
            <Text style={styles.username}>{username}</Text> followed you
          </Text>
        );
      case "post":
        return (
          <View>
            <Text
              style={[
                styles.text,
                {
                  color:
                    theme === "dark" ? Colors.dark.text : Colors.light.text,
                },
              ]}
            >
              <Text
                style={[
                  styles.username,
                  { color: theme === "dark" ? "#EEE" : "#111" },
                ]}
              >
                {username}
              </Text>{" "}
              mentioned you in a post
            </Text>
            {postText && (
              <Text
                style={[
                  styles.postText,
                  { color: theme === "dark" ? "#EEE" : "#111" },
                ]}
                numberOfLines={3}
              >
                {postText}
              </Text>
            )}
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.contentContainer}>
        {renderContent()}
        <Text
          style={[
            styles.timestamp,
            { color: theme === "dark" ? "#EEE" : "#111" },
          ]}
        >
          {timestamp}
        </Text>
      </View>
    </ThemedView>
  );
}

interface Notification {
  id: string;
  type: NotificationType;
  username: string;
  timestamp: string;
  postText?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "like",
    username: "John Doe",
    timestamp: "2 min ago",
    postText: "This is a test post",
  },
  {
    id: "2",
    type: "follow",
    username: "Jane Smith",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "post",
    username: "Mike Johnson",
    timestamp: "45 min ago",
    postText: "Hey @user, check out this awesome new feature!",
  },
  {
    id: "4",
    type: "like",
    username: "Sarah Wilson",
    timestamp: "1h ago",
    postText: "Really enjoying building this app!",
  },
  {
    id: "5",
    type: "follow",
    username: "Alex Brown",
    timestamp: "2h ago",
  },
  {
    id: "6",
    type: "post",
    username: "Emily Davis",
    timestamp: "3h ago",
    postText: "@user Would love to collaborate on this project",
  },
  {
    id: "7",
    type: "like",
    username: "Chris Taylor",
    timestamp: "5h ago",
    postText: "Just shipped a major update!",
  },
  {
    id: "8",
    type: "follow",
    username: "Pat Miller",
    timestamp: "6h ago",
  },
  {
    id: "9",
    type: "post",
    username: "Sam Anderson",
    timestamp: "8h ago",
    postText: "Hey @user, great work on the new design!",
  },
  {
    id: "10",
    type: "like",
    username: "Jordan Lee",
    timestamp: "1d ago",
    postText: "Excited to announce our latest feature!",
  },
];

export default function NotificationsScreen() {
  return (
    <BodyScrollView>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    marginRight: 12,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  username: {
    fontWeight: "600",
  },
  postText: {
    fontSize: 14,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
});

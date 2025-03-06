import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useApi } from "@/hooks/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetNotificationsResponse } from "@/app/api/notifications+api";
import { useRouter } from "expo-router";
import { type NotificationType } from "@/db/schema";

interface NotificationProps {
  type: NotificationType;
  actor: {
    userId: string;
    displayName: string;
  };
  timestamp: Date;
  postText?: string;
  onPress?: () => void;
}

function NotificationItem({
  type,
  actor,
  timestamp,
  postText,
  onPress,
}: NotificationProps) {
  const theme = useColorScheme();
  const defaultProfilePicture = `https://api.dicebear.com/7.x/bottts/png?seed=${actor.userId}`;

  const renderIcon = () => {
    switch (type) {
      case "like":
        return <Ionicons name="heart" size={24} color="#FF4B4B" />;
      case "follow":
        return <Ionicons name="person-add" size={24} color="#007AFF" />;
      case "unfollow":
        return <Ionicons name="person-remove" size={24} color="#FF6B6B" />;
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
            <Text style={styles.username}>{actor.displayName}</Text> liked your
            post
          </Text>
        );
      case "follow":
        return (
          <Text
            style={[styles.text, { color: theme === "dark" ? "#EEE" : "#111" }]}
          >
            <Text style={styles.username}>{actor.displayName}</Text> followed
            you
          </Text>
        );
      case "unfollow":
        return (
          <Text
            style={[styles.text, { color: theme === "dark" ? "#EEE" : "#111" }]}
          >
            <Text style={styles.username}>{actor.displayName}</Text> unfollowed
            you
          </Text>
        );
      case "post":
        return (
          <Text
            style={[styles.text, { color: theme === "dark" ? "#EEE" : "#111" }]}
          >
            <Text style={styles.username}>{actor.displayName}</Text> posted
            something new!
          </Text>
        );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationContainer,
        { backgroundColor: theme === "dark" ? "#1A1A1A" : "#FFF" },
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <View style={styles.contentContainer}>
        {renderContent()}
        <Text
          style={[
            styles.timestamp,
            { color: theme === "dark" ? "#999" : "#666" },
          ]}
        >
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </Text>
        {postText && (
          <Text
            style={[
              styles.postText,
              { color: theme === "dark" ? "#BBB" : "#444" },
            ]}
            numberOfLines={2}
          >
            {postText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const theme = useColorScheme();
  const api = useApi();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.notifications.get(),
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const handleNotificationPress = (
    notification: GetNotificationsResponse[0]
  ) => {
    // First close the notifications modal
    router.back();
    // Then navigate to actor's profile
    router.push({
      pathname: "/feed/profile/[userId]",
      params: { userId: notification.actor.userId },
    });
  };

  if (isLoading) {
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme === "dark" ? "#000" : "#F0F0F0" },
        ]}
      >
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.notificationContainer,
              { backgroundColor: theme === "dark" ? "#1A1A1A" : "#FFF" },
            ]}
          >
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.skeletonCircle,
                  { backgroundColor: theme === "dark" ? "#333" : "#E0E0E0" },
                ]}
              />
            </View>
            <View style={styles.contentContainer}>
              <View
                style={[
                  styles.skeletonText,
                  { backgroundColor: theme === "dark" ? "#333" : "#E0E0E0" },
                ]}
              />
              <View
                style={[
                  styles.skeletonTimestamp,
                  { backgroundColor: theme === "dark" ? "#333" : "#E0E0E0" },
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000" : "#F0F0F0" },
      ]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
    >
      {notifications?.map((notification) => (
        <NotificationItem
          key={notification.id}
          type={notification.type as NotificationType}
          actor={notification.actor}
          timestamp={new Date(notification.createdAt)}
          onPress={() => handleNotificationPress(notification)}
        />
      ))}
      {notifications?.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={{ color: theme === "dark" ? "#FFF" : "#000" }}>
            No notifications yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  notificationContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
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
    fontSize: 16,
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
  },
  postText: {
    fontSize: 14,
    marginTop: 8,
  },
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  skeletonText: {
    height: 16,
    borderRadius: 4,
    width: "70%",
    marginBottom: 8,
  },
  skeletonTimestamp: {
    height: 12,
    borderRadius: 4,
    width: "30%",
  },
});

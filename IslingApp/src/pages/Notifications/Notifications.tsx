import React, { useCallback } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNotification, AppNotification } from "../../context/NotificationContext";

export default function Notifications() {
  const { notifications, markAllAsRead } = useNotification();

  useFocusEffect(
    useCallback(() => {
      // Mark as read when opening the page
      if (notifications.some((n) => !n.read)) {
        markAllAsRead();
      }
    }, [notifications, markAllAsRead])
  );

  const renderItem = ({ item }: { item: AppNotification }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemMessage}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Notifications</Text>
        
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No new notifications.</Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  itemContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  itemMessage: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

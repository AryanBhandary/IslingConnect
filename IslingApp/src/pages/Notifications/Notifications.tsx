import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNotification, AppNotification } from "../../context/NotificationContext";

type NotificationRow =
  | { type: "header"; id: string; label: string }
  | { type: "item"; id: string; item: AppNotification };

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDateHeader = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
};

const formatRelativeTime = (timestamp: number) => {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const parseDepartmentAndStatus = (notification: AppNotification) => {
  const message = notification.message || "";
  const departmentMatch = message.match(/Your (.+?) appointment/i);
  const statusMatch = message.match(/status is now:\s*(.+)$/i);

  const department = departmentMatch?.[1]?.trim() || "Department";
  const status = statusMatch?.[1]?.trim() || "";
  return { department, status };
};

const getBadgeLabel = (department: string) => {
  const words = department
    .replace("Department", "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "NT";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const getStatusColor = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return "#E53935";
  if (normalized.includes("resched")) return "#F4B400";
  if (normalized.includes("confirm") || normalized.includes("approve")) return "#34A853";
  return "#8DC63F";
};

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

  const rows = useMemo<NotificationRow[]>(() => {
    const output: NotificationRow[] = [];
    let previousHeader = "";

    notifications.forEach((item) => {
      const createdAt = item.createdAt || Date.now();
      const header = formatDateHeader(createdAt);

      if (header !== previousHeader) {
        output.push({ type: "header", id: `header-${header}`, label: header });
        previousHeader = header;
      }

      output.push({ type: "item", id: item.id, item });
    });

    return output;
  }, [notifications]);

  const renderRow = ({ item }: { item: NotificationRow }) => {
    if (item.type === "header") {
      return <Text style={styles.dateHeader}>{item.label}</Text>;
    }

    const notification = item.item;
    const { department, status } = parseDepartmentAndStatus(notification);
    const badgeLabel = getBadgeLabel(department);
    const createdAt = notification.createdAt || Date.now();

    return (
      <View style={styles.itemContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.departmentText}>{department} Department</Text>
          <Text style={styles.messageText}>{notification.message}</Text>
          {!!status && <Text style={[styles.statusText, { color: getStatusColor(status) }]}>{status}</Text>}
        </View>

        <Text style={styles.timeText}>{formatRelativeTime(createdAt)}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Notifications</Text>
        
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>No new notifications.</Text>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={renderRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
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
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  dateHeader: {
    fontSize: 13,
    color: "#4F4F4F",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  departmentText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111",
    lineHeight: 20,
  },
  messageText: {
    marginTop: 1,
    fontSize: 13,
    color: "#5C5C5C",
    lineHeight: 16,
  },
  statusText: {
    marginTop: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#8DC63F",
  },
  timeText: {
    fontSize: 12,
    color: "#3D3D3D",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

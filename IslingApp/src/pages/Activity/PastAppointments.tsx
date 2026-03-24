import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../../services/api";
import AppLoader from "../../components/AppLoader";

interface Appointment {
  _id: string;
  department: string;
  title: string;
  date: string;
  time: string;
  status: string;
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "Completed":
      return { color: "#2E7D32", bg: "#E8F5E9", icon: "checkmark-circle" as const };
    case "Cancelled":
      return { color: "#D32F2F", bg: "#FFEBEE", icon: "close-circle" as const };
    default:
      return { color: "#666", bg: "#F5F5F5", icon: "ellipse" as const };
  }
};

export default function PastAppointments() {
  const navigation = useNavigation<any>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPastAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/appointments/my-appointments");
      const past = res.data.filter(
        (a: Appointment) => a.status === "Completed" || a.status === "Cancelled"
      );
      setAppointments(past);
    } catch (error) {
      console.error("Error fetching past appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPastAppointments();
    }, [fetchPastAppointments])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Past Appointments</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <AppLoader variant="primary" size="large" />
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={80}
              color="#CCC"
            />
            <Text style={styles.emptyText}>
              No past appointments yet.
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {appointments.map((item) => {
              const statusCfg = getStatusConfig(item.status);
              return (
                <View key={item._id} style={styles.card}>
                  {/* Department badge + title */}
                  <View style={styles.cardTop}>
                    <View style={styles.leftInfo}>
                      <View style={styles.deptCircle}>
                        <Text style={styles.deptCircleText}>
                          {item.department}
                        </Text>
                      </View>
                      <View style={styles.mainInfo}>
                        <Text style={styles.deptTitle}>
                          {item.department} Department
                        </Text>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                      </View>
                    </View>

                    {/* Status badge */}
                    <View
                      style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}
                    >
                      <Ionicons
                        name={statusCfg.icon}
                        size={14}
                        color={statusCfg.color}
                      />
                      <Text style={[styles.statusText, { color: statusCfg.color }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* Date & Time row */}
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeRow}>
                      <Ionicons name="calendar-outline" size={14} color="#333" />
                      <Text style={styles.dateTimeText}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    <View style={styles.dateTimeRow}>
                      <Ionicons name="time-outline" size={14} color="#333" />
                      <Text style={styles.dateTimeText}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontSize: 16,
  },
  listContainer: {
    gap: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  deptCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deptCircleText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  mainInfo: {
    flex: 1,
  },
  deptTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  dateTimeContainer: {
    flexDirection: "row",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
    gap: 20,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    fontSize: 12,
    color: "#333",
    marginLeft: 6,
    fontWeight: "600",
  },
});

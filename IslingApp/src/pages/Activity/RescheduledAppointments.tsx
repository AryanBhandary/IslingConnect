import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import api from "../../services/api";
import AppLoader from "../../components/AppLoader";

interface Appointment {
  _id: string;
  department: string;
  title: string;
  date: string;
  time: string;
  status: string;
  rescheduledDate?: string;
  rescheduledTime?: string;
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function RescheduledAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/appointments/my-appointments");
      const rescheduled = res.data.filter((a: Appointment) => a.status === "Reschedule Requested");
      setAppointments(rescheduled);
    } catch (error) {
      console.error("Error fetching rescheduled appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const handleReschedule = async (id: string, action: "accept" | "cancel") => {
    try {
      const res = await api.put(`/api/appointments/reschedule-handle/${id}`, { action });
      if (res.status === 200) {
        Alert.alert("Success", `Appointment ${action}ed successfully`);
        fetchAppointments();
      }
    } catch (error: any) {
      console.error("Error handling reschedule", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to process request");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <AppLoader variant="primary" size="small" />
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Rescheduled Appointments</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rescheduled appointments.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Rescheduled Appointments</Text>
      <View style={styles.outerCard}>
        {appointments.map((item) => {
          const displayDate = item.rescheduledDate ? formatDate(item.rescheduledDate) : formatDate(item.date);
          const displayTime = item.rescheduledTime || item.time;

          return (
            <View key={item._id} style={styles.innerCard}>
              <View style={styles.cardHeaderRow}>
                {/* Left section: Icon + Info */}
                <View style={styles.leftInfo}>
                  <View style={styles.deptCircle}>
                    <Text style={styles.deptCircleText}>{item.department}</Text>
                  </View>
                  <View style={styles.mainInfo}>
                    <Text style={styles.deptTitle}>{item.department} Department</Text>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                  </View>
                </View>

                {/* Right section: Date/Time */}
                <View style={styles.rightInfo}>
                  <View style={styles.dateTimeRow}>
                    <Ionicons name="calendar-outline" size={14} color="#333" />
                    <Text style={styles.dateTimeText}>{displayDate}</Text>
                  </View>
                  <View style={[styles.dateTimeRow, { marginTop: 6 }]}>
                    <Ionicons name="time-outline" size={14} color="#333" />
                    <Text style={styles.dateTimeText}>{displayTime}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnCancel]}
                  onPress={() => handleReschedule(item._id, "cancel")}
                >
                  <Text style={styles.btnTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnAccept]}
                  onPress={() => handleReschedule(item._id, "accept")}
                >
                  <Text style={styles.btnTextAccept}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 20,
    alignItems: "center",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  emptyContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  outerCard: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 20,
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  innerCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 15,
    padding: 15,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  rightInfo: {
    alignItems: "flex-start",
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
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  btnCancel: {
    borderColor: "#FF3B30",
  },
  btnAccept: {
    borderColor: "#34C759",
  },
  btnTextCancel: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "bold",
  },
  btnTextAccept: {
    color: "#34C759",
    fontSize: 14,
    fontWeight: "bold",
  },
});

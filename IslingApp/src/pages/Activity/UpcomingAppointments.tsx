import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
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
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchAppointments = async () => {
        try {
          setLoading(true);
          const res = await api.get("/api/appointments/my-appointments");
          const upcoming = res.data.filter((a: Appointment) => a.status === "Confirmed" || a.status === "Accepted");
          setAppointments(upcoming);
        } catch (error) {
          console.error("Error fetching upcoming appointments:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }, [])
  );

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
        <Text style={styles.sectionTitle}>Up Coming Appointments</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No upcoming appointments.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Up Coming Appointments</Text>
      <View style={styles.outerCard}>
        {appointments.map(item => (
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
                  <Text style={styles.dateTimeText}>{formatDate(item.date)}</Text>
                </View>
                <View style={[styles.dateTimeRow, { marginTop: 6 }]}>
                  <Ionicons name="time-outline" size={14} color="#333" />
                  <Text style={styles.dateTimeText}>{item.time}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
});

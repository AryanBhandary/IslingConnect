import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import api from "../../services/api";
import AppLoader from "../../components/AppLoader";
import styles from "./studentServicesStyles";

export default function StudentServices() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setFetching(true);
      const userDataStr = await AsyncStorage.getItem("user");
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        const studentEmail = user.email;
        const response = await api.get(`/api/attendance/reports/${studentEmail}`);
        if (response.data.success) {
          setReports(response.data.reports);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance reports:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  const handleRequestAttendance = async () => {
    Alert.alert(
      "Request Attendance Report",
      "Do you want to send a request to the admin for a new attendance report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: async () => {
            setLoading(true);
            try {
              const userDataStr = await AsyncStorage.getItem("user");
              if (!userDataStr) {
                Alert.alert("Error", "User details not found. Please log in again.");
                setLoading(false);
                return;
              }
              const user = JSON.parse(userDataStr);

              const response = await api.post("/api/attendance/request", {
                studentName: user.name,
                studentEmail: user.email,
              });

              if (response.data.success) {
                Alert.alert("Success", "Attendance report request sent successfully.");
              } else {
                Alert.alert("Error", response.data.message || "Failed to send request.");
              }
            } catch (error: any) {
              console.error("Attendance Request Error:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message || "An unexpected error occurred while sending the request."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDownload = async (reportId: string) => {
    try {
      setDownloadingId(reportId);
      const url = `${api.defaults.baseURL}/api/attendance/download/${reportId}`;
      const destination = new File(Paths.cache, `attendance_report_${reportId}.pdf`);

      const downloadedFile = await File.downloadFileAsync(url, destination, { idempotent: true });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(downloadedFile.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Attendance Report",
        });
      } else {
        Alert.alert("Downloaded", "Report downloaded successfully.");
      }
    } catch (err) {
      console.error("Download error:", err);
      Alert.alert("Error", "Could not download the report.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Attendance Reports</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.listContainer}>
        {fetching ? (
          <AppLoader variant="primary" size="large" />
        ) : reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={80}
              color="#CCC"
            />
            <Text style={styles.emptyText}>No past attendance reports yet.</Text>
          </View>
        ) : (
          reports.map((report) => (
            <View key={report._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>SSD</Text>
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.departmentName}>{report.department}</Text>
                  <Text style={styles.cardDescription}>{report.description}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.dateText}>{formatDate(report.date || report.createdAt)}</Text>
                </View>
              </View>

              {report.status === "Sent" ? (
                <TouchableOpacity
                  style={styles.downloadButton}
                  disabled={downloadingId === report._id}
                  onPress={() => handleDownload(report._id)}
                >
                  {downloadingId === report._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.downloadButtonText}>Download Report</Text>
                      <Ionicons name="download-outline" size={18} color="#ffffff" />
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={[styles.downloadButton, { backgroundColor: '#B0B0B0' }]}>
                  <Text style={styles.downloadButtonText}>Pending</Text>
                  <Ionicons name="time-outline" size={18} color="#ffffff" />
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequestAttendance}
          disabled={loading}
        >
          <Text style={styles.requestButtonText}>
            {loading ? "Requesting..." : "Request report"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

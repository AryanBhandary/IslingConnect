import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, TextInput, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../services/api";

export default function Profile() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    getUserData();
  }, []);

  // Password Reset State
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!user?.email) return Alert.alert("Error", "User email not found");
    setLoading(true);
    try {
      await api.post("/api/auth/send-reset-otp", { email: user.email });
      setOtpSent(true);
      Alert.alert("Success", "OTP has been sent to your email");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword || !otp) {
      return Alert.alert("Error", "Please fill all fields and enter OTP");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "New passwords do not match");
    }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        email: user.email,
        oldPassword,
        newPassword,
        confirmPassword,
        otp
      });
      Alert.alert("Success", "Password updated successfully");
      setResetModalVisible(false);
      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpSent(false);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          navigation.navigate("Login");
        }
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={100} color="#242FA3" />
        <Text style={styles.userName}>{user?.name || "User"}</Text>
        <Text style={styles.userEmail}>{user?.email || ""}</Text>
        <Text style={styles.userEmail}>{user?.phone || ""}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("MyReports")}
        >
          <MaterialCommunityIcons name="clipboard-text-outline" size={24} color="#333" />
          <Text style={styles.menuText}>My Reports</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("PastAppointments")}
        >
          <Ionicons name="time-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Past Appointments</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setResetModalVisible(true)}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Reset Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4d4d" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Password Reset Modal */}
      <Modal
        visible={resetModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setResetModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Old Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <View style={styles.otpSection}>

                <TextInput
                  style={[styles.otpInput, !otpSent && { backgroundColor: "#F0F0F0" }]}
                  placeholder="OTP"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  editable={otpSent}
                />

                <TouchableOpacity
                  style={[styles.otpBtn, loading && { opacity: 0.7 }]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading && !otpSent ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.otpBtnText}>{otpSent ? "Resend OTP" : "Send OTP"}</Text>
                  )}
                </TouchableOpacity>

              </View>

              <TouchableOpacity
                style={[styles.submitBtn, (!otpSent || loading) && { backgroundColor: "#CCC" }]}
                onPress={handleResetPassword}
                disabled={!otpSent || loading}
              >
                {loading && otpSent ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
    textTransform: "capitalize",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
  },
  logoutText: {
    color: "#ff4d4d",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  otpSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  otpBtn: {
    backgroundColor: "#242FA3",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  otpBtnText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  otpInput: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    width: "70%",
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#242FA3",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  submitBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});


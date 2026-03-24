import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4d4d" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
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
});


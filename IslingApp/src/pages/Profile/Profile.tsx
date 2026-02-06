import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function Profile() {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    // Optional: show a confirmation alert
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Navigate back to Login or Landing page
          navigation.navigate("Login");
          // Optional: clear user session / tokens here
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Profile Page</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});


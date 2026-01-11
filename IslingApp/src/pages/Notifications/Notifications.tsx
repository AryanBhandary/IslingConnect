import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Navbar from "../Navbar/Navbar";

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Notifications Page</Text>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 50,
  },
});

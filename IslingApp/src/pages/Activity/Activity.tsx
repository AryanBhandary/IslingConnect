import React from "react";
import { View, Text, StyleSheet } from "react-native";
export default function Activity() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is Activity Page</Text>
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

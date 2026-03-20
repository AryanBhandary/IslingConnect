import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

import UpcomingAppointments from "./UpcomingAppointments";
import RescheduledAppointments from "./RescheduledAppointments";
import PendingAppointments from "./PendingAppointments";

export default function Activity() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Activities</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <UpcomingAppointments />
        <RescheduledAppointments />
        <PendingAppointments />
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
});

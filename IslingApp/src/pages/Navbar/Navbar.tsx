import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function Navbar({ state, navigation }: BottomTabBarProps) {
  const routeName = state.routes[state.index].name;

  const handleNavigate = (name: string) => {
    navigation.navigate(name);
  };

  return (
    <View style={styles.navbar}>
      {/* Home */}
      <TouchableOpacity onPress={() => handleNavigate("Home")}>
        <View style={styles.navItem}>
          <Ionicons
            name={routeName === "Home" ? "home" : "home-outline"}
            size={24}
            color={routeName === "Home" ? "#000000" : "#535353"}
          />
          <Text
            style={[
              styles.link,
              {
                color: routeName === "Home" ? "#000000" : "#535353",
                fontWeight: routeName === "Home" ? "bold" : "normal",
              },
            ]}
          >
            Home
          </Text>
        </View>
      </TouchableOpacity>

      {/* Notifications */}
      <TouchableOpacity onPress={() => handleNavigate("Notifications")}>
        <View style={styles.navItem}>
          <Ionicons
            name={
              routeName === "Notifications"
                ? "notifications"
                : "notifications-outline"
            }
            size={24}
            color={routeName === "Notifications" ? "#000000" : "#535353"}
          />
          <Text
            style={[
              styles.link,
              {
                color: routeName === "Notifications" ? "#000000" : "#535353",
                fontWeight:
                  routeName === "Notifications" ? "bold" : "normal",
              },
            ]}
          >
            Notification
          </Text>
        </View>
      </TouchableOpacity>

      {/* Activity */}
      <TouchableOpacity onPress={() => handleNavigate("Activity")}>
        <View style={styles.navItem}>
          <Ionicons
            name={routeName === "Activity" ? "flash" : "flash-outline"}
            size={24}
            color={routeName === "Activity" ? "#000000" : "#535353"}
          />
          <Text
            style={[
              styles.link,
              {
                color: routeName === "Activity" ? "#000000" : "#535353",
                fontWeight: routeName === "Activity" ? "bold" : "normal",
              },
            ]}
          >
            Activity
          </Text>
        </View>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity onPress={() => handleNavigate("Profile")}>
        <View style={styles.navItem}>
          <Ionicons
            name={routeName === "Profile" ? "person" : "person-outline"}
            size={24}
            color={routeName === "Profile" ? "#000000" : "#535353"}
          />
          <Text
            style={[
              styles.link,
              {
                color: routeName === "Profile" ? "#000000" : "#535353",
                fontWeight: routeName === "Profile" ? "bold" : "normal",
              },
            ]}
          >
            Profile
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",

    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Shadow (Android)
    elevation: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    fontSize: 12,
    marginTop: 4,
  },
});

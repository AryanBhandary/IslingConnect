import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./homeStyles";
import Navbar from "../Navbar/Navbar";
import { useNavigation } from "@react-navigation/native";

interface User {
  name: string;
  [key: string]: any;
}

// Avatar component
interface AvatarProps {
  username: string;
  size?: number;
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  username,
  size = 50,
  backgroundColor = "#3B3B3B",
}) => {
  const initial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: size / 2 }}>
        {initial}
      </Text>
    </View>
  );
};

export default function Background() {
    const navigation = useNavigation<any>();
    const state = navigation.getState();
  const [username, setUsername] = useState("User");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user: User = JSON.parse(storedUser);
          setUsername(user?.name || "User");
        }
      } catch (error) {
        console.log("Failed to load user", error);
      }
    };

    getUser();
  }, []);

  return (
    <>
      <ImageBackground
        source={require("../../../assets/banner.jpg")}
        style={styles.background}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.overlay} />

        {/* Username + Avatar container */}
        <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
          style={{
            position: "absolute",
            top: 40,
            right: 30,
            flexDirection: "row-reverse",
            alignItems: "center",
          }}

        >
          <Avatar username={username} />
        </TouchableOpacity>

        {/* Text container */}
        <View style={styles.container}>
          <Text style={styles.title}>IslingConnect</Text>
          <Text style={styles.subtitle}>
            Report lost items, book appointments, download reports, and stay
            updated — all from your mobile device.
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.greeting}>
        <Text style={styles.greetTitle}>
          {getGreeting()} {username}
        </Text>
        <Text style={styles.greetSubtitle}>How can we help you today?</Text>
      </View>

      <Navbar />
    </>
  );
}

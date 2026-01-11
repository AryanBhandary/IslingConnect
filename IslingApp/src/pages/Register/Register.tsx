import { useState } from "react";
import axios from "axios";
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageStyle,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import { RootStackParamList } from "../../types";
import styles from "../Login/loginStyles";
import { APP_API_URI } from "../../../config";

export default function Register() {
  type NavigationProps = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProps>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !email || !phone || !password) {
      return Alert.alert("Fill in all fields");
    }

    try {
      await axios.post(`${APP_API_URI}/api/auth/register`, {
        username,
        email,
        phone,
        password,
        role: "user", // default student
      });

      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Home");
    } catch (err: any) {
      console.log("Signup error:", err.response?.data || err.message);
      Alert.alert(
        "Signup failed",
        err.response?.data?.message || "Try again"
      );
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/Kumari.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay} />

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="blue" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.heading}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.image as ImageStyle}
          />
          <Text style={styles.title}>IslingConnect</Text>
          <Text style={styles.subtitle}>
            Your all in one campus companion
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>
            Please fill in your details.
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            style={styles.input}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            style={styles.input}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleSignup}>
            <Text style={styles.loginText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ textAlign: "center", marginTop: 12 }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

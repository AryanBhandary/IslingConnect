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

import styles from "../Login/loginStyles";
import { APP_API_URI } from "../../../config";

export default function Register() {
  type NavigationProps = NavigationProp<any>;
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) return Alert.alert("Please enter your email");

    if (!email.endsWith("@islingtoncollege.edu.np")) {
      return Alert.alert("Validation Error", "Only @islingtoncollege.edu.np emails are allowed");
    }

    setLoading(true);
    try {
      await axios.post(`${APP_API_URI}/api/auth/send-otp`, { email });
      setIsOtpSent(true);
      Alert.alert("Success", "OTP sent to your email");
    } catch (err: any) {
      console.log("OTP error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !phone || !password || !otp) {
      return Alert.alert("Fill in all fields including OTP");
    }

    setLoading(true);
    try {
      await axios.post(`${APP_API_URI}/api/auth/register`, {
        username,
        email,
        phone,
        password,
        otp,
        role: "user", // default student
      });

      Alert.alert("Success", "Account created successfully");
      navigation.navigate("AuthLoading");
    } catch (err: any) {
      console.log("Signup error:", err.response?.data || err.message);
      Alert.alert(
        "Signup failed",
        err.response?.data?.message || "Try again"
      );
    } finally {
      setLoading(false);
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (isOtpSent) setIsOtpSent(false);
              }}
              placeholder="Your @islingtoncollege.edu.np email"
              style={[styles.input, { flex: 1 }]}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {!isOtpSent && (
              <TouchableOpacity
                style={[styles.loginBtn, { height: 40, width: 80, marginTop: 0, marginLeft: 10, padding: 0, justifyContent: 'center' }]}
                onPress={handleSendOtp}
                disabled={loading}
              >
                <Text style={[styles.loginText, { fontSize: 12 }]}>{loading ? "..." : "Send OTP"}</Text>
              </TouchableOpacity>
            )}
          </View>

          {isOtpSent && (
            <>
              <Text style={styles.label}>Verification OTP</Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 6-digit code"
                style={styles.input}
                keyboardType="number-pad"
              />
            </>
          )}

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

          <TouchableOpacity
            style={[styles.loginBtn, (!isOtpSent || loading) && { opacity: 0.5 }]}
            onPress={handleSignup}
            disabled={!isOtpSent || loading}
          >
            <Text style={styles.loginText}>{loading ? "Processing..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ textAlign: "center", marginTop: 12 }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

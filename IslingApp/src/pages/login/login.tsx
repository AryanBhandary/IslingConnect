import { useState } from "react";
import axios from 'axios';
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageStyle,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {jwtDecode} from "jwt-decode";


import { RootStackParamList } from "../../types";
import styles from "../../styles/login";
import { APP_API_URI } from "../../../config";

export default function Login() {

  type NavigationProps = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProps>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      return Alert.alert("Fill in all the fields");
    }

    try {
      const response = await axios.post(
        `${APP_API_URI}/api/auth/login`,  
        { email, password }
      );

      const token = response.data.token;
      await AsyncStorage.setItem("token", token);

      const decoded: any = jwtDecode(token);
      const role = decoded.role;

      if (role === "user") {
        navigation.navigate("Home");
      } 
      else if (role === "admin" ||
        role === "ss_admin" ||
        role === "lf_admin" ||
        role === "pat_admin" ||
        role === "it_admin"
      ){
        Alert.alert("Invalid User")
      }
      
      else {
        Linking.openURL("User not found");
      }
    } catch (err: any) {
    console.log("Axios error:", err.response?.data || err.message);
    Alert.alert("Login failed", err.response?.data?.message || "Try again.");
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
          <Text style={styles.subtitle}>Your all in one campus companion</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Welcome Back!</Text>
          <Text style={styles.formSubtitle}>
            Please enter your credentials.
          </Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

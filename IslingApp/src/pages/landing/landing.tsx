import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../../styles/landing";

type LandingScreenProp = {
  navigate: (screen: string) => void;
};

export default function Landing() {
  const navigation = useNavigation<LandingScreenProp>();
  return (
    <ImageBackground
      source={require("../../../assets/Kumari.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <View style={styles.heading}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.image}
          />
          <Text style={styles.title}>IslingConnect</Text>
          <Text style={styles.subtitle}>Your all in one campus companion</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

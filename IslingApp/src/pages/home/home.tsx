import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageStyle
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import styles from "../../styles/login";

export default function Home() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>This is home page!!!...</Text>
    </View>
  );
}

import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styles from "./homeStyles";

export default function Departments() {
  return (
    <View style={styles.departList}>
      <TouchableOpacity style={styles.options}>
        <Image 
          source={require("../../../assets/ss.jpg")}
          style={styles.icon}
        />
        <Text style={styles.optionText}>Student Services</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.options}>
        <Image 
          source={require("../../../assets/lf.png")}
          style={styles.icon}
        />
        <Text style={styles.optionText}>Lost & Found</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.options}>
        <Image 
          source={require("../../../assets/it.png")}
          style={styles.icon}
        />
        <Text style={styles.optionText}>IT Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.options} >
        <Image 
          source={require("../../../assets/pat.jpg")}
          style={styles.icon}
        />
        <Text style={[styles.optionText, {width: 85}]}>PAT Department</Text>
      </TouchableOpacity>
    </View>
  );
}

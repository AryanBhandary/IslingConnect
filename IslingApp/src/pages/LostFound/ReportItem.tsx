import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppLoader from "../../components/AppLoader";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./reportItemStyles";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, APP_API_URI } from "../../../config";

export default function ReportItem() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { type } = route.params || { type: "lost" };

    const [image, setImage] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [itemName, setItemName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState("");
    const [linkInfo, setLinkInfo] = useState(false);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const uploadToCloudinary = async (uri: string) => {
        try {
            const data = new FormData();
            data.append("file", {
                uri,
                type: "image/jpeg",
                name: "upload.jpg",
            } as any);
            data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const result = await response.json();
            if (result.secure_url) {
                return result.secure_url;
            } else {
                throw new Error("Upload failed: " + JSON.stringify(result));
            }
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw error;
        }
    };

    const handleReport = async () => {
        if (!category || !itemName || !location) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            let imageUrl = null;
            if (image) {
                if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.includes("your_cloud_name")) {
                    Alert.alert("Note", "Cloudinary credentials not set. Using placeholder image URL.");
                    imageUrl = "https://via.placeholder.com/300";
                } else {
                    imageUrl = await uploadToCloudinary(image);
                }
            }

            const reportData = {
                type,
                category,
                itemName,
                date: date.toISOString(),
                location,
                imageUrl,
                linkUserInfo: linkInfo,
            };

            const token = await AsyncStorage.getItem("token");

            const response = await axios.post(
                `${APP_API_URI}/api/lost-found/report`,
                reportData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                Alert.alert("Success", `Your ${type} item report has been submitted.`, [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                throw new Error("Failed to submit report");
            }

        } catch (error: any) {
            console.error("[Frontend] Report submission error:", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message || "Please try again.";
            Alert.alert("Error", `Failed to submit report: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    Report a {type === "lost" ? "Lost" : "Found"} Item
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { flexGrow: 1 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.label}>Upload an image</Text>
                <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.uploadedImage} />
                    ) : (
                        <MaterialCommunityIcons name="camera-outline" size={50} color="#999" />
                    )}
                </TouchableOpacity>

                <Text style={styles.label}>
                    Item Category <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="eg: Charger, mobile, keys, etc..."
                    placeholderTextColor="#999"
                    value={category}
                    onChangeText={setCategory}
                />

                <Text style={styles.label}>
                    Item Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="eg: Iphone, Car keys, Samsung etc..."
                    placeholderTextColor="#999"
                    value={itemName}
                    onChangeText={setItemName}
                />

                <Text style={styles.label}>
                    {type === "lost" ? "Lost" : "Found"} on: <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                    style={[styles.input, styles.dateInput]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={{ color: date ? "#000" : "#999" }}>
                        {date.toLocaleDateString("en-GB")}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                <Text style={styles.label}>
                    Location {type === "lost" ? "last seen" : "found"}:{" "}
                    <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="eg: Block, Parking, Class, etc..."
                    placeholderTextColor="#999"
                    value={location}
                    onChangeText={setLocation}
                />

                <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        style={[
                            styles.checkbox,
                            { backgroundColor: linkInfo ? "#242FA3" : "transparent" },
                        ]}
                        onPress={() => setLinkInfo(!linkInfo)}
                    >
                        {linkInfo && <Ionicons name="checkmark" size={16} color="white" />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>
                        Your phone number and name will be linked to this post for the finder
                        to contact you.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.reportButton, loading && { opacity: 0.7 }]}
                    onPress={handleReport}
                    disabled={loading}
                >
                    {loading ? (
                        <AppLoader variant="onBlue" size="small" />
                    ) : (
                        <Text style={styles.reportButtonText}>Report</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

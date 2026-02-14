import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Alert, TextInput } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./itemDetailStyles";
import { APP_API_URI } from "../../../config";

export default function ItemDetail() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { item: initialItem } = route.params;
    const [item, setItem] = useState(initialItem);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [scanMode, setScanMode] = useState(false);
    const [claimCodeInput, setClaimCodeInput] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                setCurrentUser(JSON.parse(userData));
            }
        };
        getUser();
    }, []);

    const isUploader = currentUser?.id === item.user?._id || currentUser?.id === item.user;

    const formattedDate = new Date(item.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handleGenerateCode = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(`${APP_API_URI}/api/lost-found/generate-code/${item._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItem({ ...item, claimCode: response.data.claimCode, status: "pending" });
            Alert.alert("Success", "Return code generated! Show this to the reclaimer.");
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Failed to generate code");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClaim = async () => {
        if (!claimCodeInput) return;
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.post(`${APP_API_URI}/api/lost-found/verify-claim`, {
                itemId: item._id,
                claimCode: claimCodeInput.toUpperCase()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItem({ ...item, status: "returned", reclaimer: currentUser });
            Alert.alert("Success", "Item successfully returned and recorded!");
            setScanMode(false);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    const handleStartChat = async () => {
        if (!currentUser) {
            Alert.alert("Error", "Please login to start a chat");
            return;
        }
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const otherUserId = item.user?._id || item.user;

            const response = await axios.post(`${APP_API_URI}/api/chat/init`, {
                participantId: otherUserId,
                itemId: item._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigation.navigate("Chat", {
                chatId: response.data._id,
                item: item,
                otherUser: item.user
            });
        } catch (error: any) {
            Alert.alert("Error", "Failed to start chat session");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {item.status !== "active" && (
                <View style={[styles.statusBadge, { backgroundColor: item.status === "returned" ? "#2E7D32" : "#F57F17" }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.imageUrl || "https://via.placeholder.com/400" }}
                        style={styles.image}
                    />
                </View>

                <View style={styles.content}>
                    <View style={styles.badgeContainer}>
                        <View style={[styles.badge, item.type === "found" ? styles.foundBadge : styles.lostBadge]}>
                            <Text style={[styles.badgeText, item.type === "found" ? styles.foundText : styles.lostText]}>
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.itemName}>{item.itemName}</Text>

                    <View style={styles.dateContainer}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={20} color="#666" />
                        <Text style={styles.dateText}>{formattedDate}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Item Information</Text>

                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={22} color="#242FA3" />
                            <Text style={styles.infoText}>{item.location}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="tag-outline" size={22} color="#242FA3" />
                            <Text style={styles.infoText}>{item.category}</Text>
                        </View>
                    </View>

                    {/* Return Process Section */}
                    {item.status !== "returned" ? (
                        <View style={styles.returnSection}>
                            <Text style={styles.returnTitle}>Return Process</Text>
                            {isUploader ? (
                                <>
                                    <Text style={{ textAlign: "center", color: "#666", marginBottom: 15 }}>
                                        {item.status === "pending" ? "Share this code with the reclaimer to complete the return." : "Generate a secure code to confirm item handover."}
                                    </Text>
                                    {item.claimCode ? (
                                        <View style={styles.qrContainer}>
                                            <Text style={styles.qrCodeText}>{item.claimCode}</Text>
                                            <Text style={styles.qrLabel}>SCAN OR ENTER MANUALLY</Text>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            style={[styles.chatButton, { width: "100%", height: 50 }]}
                                            onPress={handleGenerateCode}
                                            disabled={loading}
                                        >
                                            <Text style={styles.chatButtonText}>{loading ? "Generating..." : "Generate Handover Code"}</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Text style={{ textAlign: "center", color: "#666", marginBottom: 15 }}>
                                        Enter the code provided by the uploader to confirm you have received the item.
                                    </Text>
                                    <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
                                        <TextInput
                                            style={{ flex: 1, backgroundColor: "#FFF", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#DDD", textAlign: "center", fontWeight: "bold" }}
                                            placeholder="ENTER CODE"
                                            value={claimCodeInput}
                                            onChangeText={setClaimCodeInput}
                                            autoCapitalize="characters"
                                        />
                                        <TouchableOpacity
                                            style={[styles.chatButton, { width: 100, borderRadius: 10, height: 50 }]}
                                            onPress={handleVerifyClaim}
                                            disabled={loading || !claimCodeInput}
                                        >
                                            <Text style={[styles.chatButtonText, { fontSize: 14, marginLeft: 0 }]}>{loading ? "..." : "Verify"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    ) : (
                        <View style={[styles.returnSection, { backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }]}>
                            <Ionicons name="checkmark-circle" size={40} color="#2E7D32" />
                            <Text style={[styles.returnTitle, { color: "#2E7D32" }]}>Item Returned</Text>
                            <Text style={{ textAlign: "center", color: "#666" }}>
                                Handover confirmed on {new Date(item.updatedAt || Date.now()).toLocaleDateString("en-GB")}
                            </Text>
                        </View>
                    )}

                    {!isUploader && item.status === "active" && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Uploader Information</Text>
                            <View style={styles.uploaderCard}>
                                <View style={styles.uploaderRow}>
                                    <MaterialCommunityIcons name="account-circle-outline" size={50} color="#242FA3" />
                                    <View style={styles.uploaderInfo}>
                                        <Text style={styles.uploaderName}>{item.user?.username || "Unknown User"}</Text>
                                        <Text style={styles.uploaderLabel}>Posted by</Text>
                                    </View>
                                </View>

                                <View style={styles.contactItem}>
                                    <Ionicons name="call-outline" size={18} color="#666" />
                                    <Text style={styles.contactText}>{item.user?.phone || "N/A"}</Text>
                                </View>

                                <View style={styles.contactItem}>
                                    <Ionicons name="mail-outline" size={18} color="#666" />
                                    <Text style={styles.contactText}>{item.user?.email || "N/A"}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {!isUploader && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.chatButton, loading && { opacity: 0.7 }]}
                        onPress={handleStartChat}
                        disabled={loading}
                    >
                        <MaterialCommunityIcons name="chat-outline" size={24} color="#FFF" />
                        <Text style={styles.chatButtonText}>
                            {loading ? "Initializing..." : "Chat with Uploader"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

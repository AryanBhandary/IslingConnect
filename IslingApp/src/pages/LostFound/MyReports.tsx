import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoader from "../../components/AppLoader";
import styles from "../LostFound/lostFoundStyles";
import { APP_API_URI } from "../../../config";

export default function MyReports() {
    const navigation = useNavigation<any>();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyItems = useCallback(async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(`${APP_API_URI}/api/lost-found/my-items`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching my items:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchMyItems();
        }, [fetchMyItems])
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>My Reports</Text>
                <View style={[styles.headerIcons, { width: 30 }]} />
            </View>

            <ScrollView contentContainerStyle={[styles.content, { flexGrow: 1 }]} showsVerticalScrollIndicator={false}>
                <View style={styles.listContainer}>
                    {loading ? (
                        <AppLoader variant="primary" size="large" />
                    ) : items.length === 0 ? (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 100 }}>
                            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#CCC" />
                            <Text style={{ textAlign: "center", marginTop: 20, color: "#999", fontSize: 16 }}>
                                You haven't reported any items yet.
                            </Text>
                        </View>
                    ) : (
                        items.map((item) => (
                            <TouchableOpacity
                                key={item._id}
                                style={styles.card}
                                onPress={() => navigation.navigate("ItemDetail", { item })}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
                                        style={styles.itemImage}
                                    />
                                    <View style={[styles.badge, item.type === "found" ? styles.foundBadge : styles.lostBadge]}>
                                        <Text style={[styles.badgeText, item.type === "found" ? styles.foundText : styles.lostText]}>
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.detailsContainer}>
                                    <View style={styles.topRow}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.itemName}</Text>
                                        <View style={[styles.badge, { backgroundColor: item.status === "returned" ? "#E8F5E9" : (item.status === "pending" ? "#FFF8E1" : "#F5F5F5"), position: "relative", top: 0, left: 0 }]}>
                                            <Text style={{ fontSize: 10, fontWeight: "bold", color: item.status === "returned" ? "#2E7D32" : (item.status === "pending" ? "#F57F17" : "#666") }}>
                                                {item.status.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <View style={[styles.infoItem, { flex: 1 }]}>
                                            <Ionicons name="location-outline" size={16} color="#000" />
                                            <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <MaterialCommunityIcons name="tag-outline" size={16} color="#000" />
                                            <Text style={styles.detailText} numberOfLines={1}>{item.category}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.chatButtonContainer}>
                                        <View style={[styles.chatButton, { backgroundColor: "#242FA3" }]}>
                                            <Text style={[styles.chatButtonText, { color: "#FFF", fontSize: 14 }]}>Manage Item</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

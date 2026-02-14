import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Image, ActivityIndicator } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AppLoader from "../../components/AppLoader";
import styles from "./lostFoundStyles";
import { APP_API_URI } from "../../../config";

export default function LostFound() {
    const navigation = useNavigation<any>();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"all" | "lost" | "found">("all");
    const [showFilters, setShowFilters] = useState(false);

    // Frontend lazy loading state
    const [visibleCount, setVisibleCount] = useState(10);

    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${APP_API_URI}/api/lost-found/items`);
            setItems(response.data);
            setVisibleCount(10);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchItems();
        }, [fetchItems])
    );

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === "all" || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const displayItems = filteredItems.slice(0, visibleCount);

    const loadMore = () => {
        if (visibleCount < filteredItems.length) {
            setVisibleCount(prev => prev + 10);
        }
    };

    const renderHeader = () => (
        <View style={{ width: "100%" }}>
            <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Lost Something? Or, Found Something?</Text>
                <Text style={styles.heroSubtitle}>We got you</Text>
            </View>

            <View style={styles.buttonContainer}>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        style={styles.lostButton}
                        onPress={() => navigation.navigate("ReportItem", { type: "lost" })}
                    >
                        <Text style={styles.lostButtonText}>I Lost Something</Text>
                        <Text style={styles.buttonDesc}>Report your lost item and let the community help you find it.</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: "center", marginTop: 10 }}>
                    <TouchableOpacity
                        style={styles.foundButton}
                        onPress={() => navigation.navigate("ReportItem", { type: "found" })}
                    >
                        <Text style={styles.foundButtonText}>I Found Something</Text>
                        <Text style={styles.buttonDesc}>Help reunite a found item with its owner.</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ height: 20 }} />
        </View>
    );

    const renderItem = ({ item }: { item: any }) => (
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
                {item.status === "pending" && (
                    <View style={[styles.badge, { backgroundColor: "#FFF8E1", bottom: 10, top: "auto" }]}>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: "#F57F17" }}>PENDING</Text>
                    </View>
                )}
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.itemName}</Text>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={18} color="#000" />
                        <Text style={styles.detailText}>
                            {new Date(item.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={[styles.infoItem, { flex: 1 }]}>
                        <Ionicons name="location-outline" size={18} color="#000" />
                        <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <MaterialCommunityIcons name="tag-outline" size={18} color="#000" />
                        <Text style={styles.detailText} numberOfLines={1}>{item.category}</Text>
                    </View>
                </View>

                <View style={styles.chatButtonContainer}>
                    <View style={styles.chatButton}>
                        <MaterialCommunityIcons name="chat-outline" size={20} color="#000" />
                        <Text style={styles.chatButtonText}>Chat</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => (
        <View style={{ paddingBottom: 20 }}>
            {loading && <AppLoader variant="primary" size="large" />}
            {!loading && filteredItems.length === 0 && (
                <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>
                    {searchQuery ? "No items match your search." : "No items reported yet."}
                </Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Lost and Found</Text>
                <TouchableOpacity style={styles.headerIcons} onPress={() => navigation.navigate("ChatList")}>
                    <MaterialCommunityIcons name="chat-outline" size={26} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search"
                        style={styles.searchInput}
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                            setVisibleCount(10);
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.filterButton, showFilters && { backgroundColor: "#E0E0E0" }]}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Ionicons name="options-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {showFilters && (
                <View style={styles.filterOptions}>
                    {(["all", "lost", "found"] as const).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterChip, filterType === type && styles.activeFilterChip]}
                            onPress={() => {
                                setFilterType(type);
                                setVisibleCount(10);
                            }}
                        >
                            <Text style={[styles.filterChipText, filterType === type && styles.activeFilterChipText]}>
                                {type === "all" ? "All Items" : type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <FlatList
                data={displayItems}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    );
}

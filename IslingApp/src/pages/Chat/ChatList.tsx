import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { APP_API_URI } from "../../../config";
import AppLoader from "../../components/AppLoader";

export default function ChatList() {
  const navigation = useNavigation<any>();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchChats = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (userData) setCurrentUser(JSON.parse(userData));

      const res = await axios.get(`${APP_API_URI}/api/chat/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [fetchChats]),
  );

  const renderChatItem = ({ item: chat }: { item: any }) => {
    const otherUser = chat.participants.find(
      (p: any) => p._id !== currentUser?.id,
    );

    return (
      <TouchableOpacity
        style={styles.chatCard}
        onPress={() =>
          navigation.navigate("Chat", {
            chatId: chat._id,
            item: chat.item,
            otherUser,
          })
        }
      >
        <Image
          source={{
            uri: chat.item?.imageUrl || "https://via.placeholder.com/60",
          }}
          style={styles.itemImage}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>
              {otherUser?.username || "Unknown"}
            </Text>
            <Text style={styles.timeText}>
              {new Date(chat.lastMessageTime).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.itemName}>{chat.item?.itemName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage || "No messages yet"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {loading ? (
        <AppLoader variant="primary" size="large" style={{ flex: 1 }} />
      ) : chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color="#EEE" />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    backgroundColor: "#FFF",
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: "#000000" },
  list: { padding: 15 },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
  } as ImageStyle,
  chatInfo: { flex: 1, marginLeft: 15 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: { fontSize: 16, fontWeight: "bold", color: "#333", flex: 1 },
  timeText: { fontSize: 11, color: "#999" },
  itemName: { fontSize: 12, color: "#242FA3", fontWeight: "600", marginTop: 2 },
  lastMessage: { fontSize: 13, color: "#666", marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, color: "#999", fontSize: 16 },
});

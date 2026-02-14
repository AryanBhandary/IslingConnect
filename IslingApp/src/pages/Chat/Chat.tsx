import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { APP_API_URI } from "../../../config";
import SocketService from "../../services/SocketService";
import AppLoader from "../../components/AppLoader";

export default function Chat() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { chatId, item, otherUser } = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const setup = async () => {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);

        // Fetch History
        try {
          const res = await axios.get(
            `${APP_API_URI}/api/chat/messages/${chatId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setMessages(res.data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        } finally {
          setLoading(false);
        }

        // Socket setup
        SocketService.connect();
        SocketService.joinRoom(chatId);

        const socket = SocketService.getSocket();
        socket?.on("receive_message", (data: any) => {
          setMessages((prev) => [...prev, data]);
        });
      }
    };

    setup();

    return () => {
      const socket = SocketService.getSocket();
      socket?.off("receive_message");
    };
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const messageData = {
      room: chatId,
      sender: currentUser.id,
      content: newMessage,
    };

    SocketService.sendMessage(chatId, currentUser.id, newMessage);
    setNewMessage("");
  };

  const renderMessage = ({ item: msg }: { item: any }) => {
    const isMine = msg.sender === currentUser?.id;
    return (
      <View
        style={[
          styles.messageWrapper,
          isMine ? styles.myMessageWrapper : styles.theirMessageWrapper,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.myBubble : styles.theirBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine ? styles.myMessageText : styles.theirMessageText,
            ]}
          >
            {msg.content}
          </Text>
          <Text style={styles.timeText}>
            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{otherUser?.username || "Chat"}</Text>
          <Text style={styles.itemRef}>{item?.itemName}</Text>
        </View>
      </View>

      {loading ? (
        <AppLoader variant="primary" size="large" style={{ flex: 1 }} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerInfo: { marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: "bold" },
  itemRef: { fontSize: 12, color: "#666" },
  messagesList: { padding: 15 },
  messageWrapper: { marginBottom: 10, maxWidth: "80%" },
  myMessageWrapper: { alignSelf: "flex-end" },
  theirMessageWrapper: { alignSelf: "flex-start" },
  messageBubble: { padding: 12, borderRadius: 20 },
  myBubble: { backgroundColor: "#242FA3", borderBottomRightRadius: 4 },
  theirBubble: {
    backgroundColor: "#FFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  messageText: { fontSize: 15 },
  myMessageText: { color: "#FFF" },
  theirMessageText: { color: "#333" },
  timeText: {
    fontSize: 10,
    color: "rgba(0,0,0,0.4)",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#242FA3",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

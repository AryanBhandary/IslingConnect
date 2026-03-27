import React, { useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocketService from "../../services/SocketService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home/home";
import Notifications from "../Notifications/Notifications";
import Activity from "../Activity/Activity";
import Profile from "../Profile/Profile";
import Navbar from "./Navbar";
import ChatList from "../Chat/ChatList";
import { useNotification } from "../../context/NotificationContext";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { addNotification } = useNotification();

    useEffect(() => {
        const setupSocket = async () => {
            try {
                const userJson = await AsyncStorage.getItem("user");
                if (userJson) {
                    const user = JSON.parse(userJson);
                    if (user && user.id) {
                        SocketService.connect();
                        SocketService.joinUserRoom(user.id);
                        SocketService.on("appointment_status_changed", (data) => {
                            addNotification(
                                "Appointment Update",
                                `Your ${data.department} appointment status is now: ${data.status}`
                            );
                        });
                    }
                }
            } catch (error) {
                console.error("Error setting up socket", error);
            }
        };

        setupSocket();

        return () => {
            SocketService.off("appointment_status_changed");
            // Note: We don't forcefully disconnect globally here if Chat might still need it,
            // but since MainTabNavigator unmounts only on logout, it's safe to disconnect.
            SocketService.disconnect();
        };
    }, []);

    return (
        <Tab.Navigator
            tabBar={(props) => <Navbar state={props.state} descriptors={props.descriptors} navigation={props.navigation} insets={props.insets} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Notifications" component={Notifications} />
            <Tab.Screen name="Activity" component={Activity} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

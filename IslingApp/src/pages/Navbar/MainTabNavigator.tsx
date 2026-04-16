import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocketService from "../../services/SocketService";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home/home";
import Notifications from "../Notifications/Notifications";
import Activity from "../Activity/Activity";
import Profile from "../Profile/Profile";
import Navbar from "./Navbar";
import { useNotification } from "../../context/NotificationContext";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { addAppointmentNotification } = useNotification();

    useEffect(() => {
        const handleAppointmentStatusChanged = (data: any) => {
            addAppointmentNotification(data);
        };

        const setupSocket = async () => {
            try {
                const userJson = await AsyncStorage.getItem("user");
                if (!userJson) return;

                const user = JSON.parse(userJson);
                if (user && user.id) {
                    SocketService.connect();
                    SocketService.joinUserRoom(user.id);
                    // Clear any stale listeners (e.g. after fast refresh), then bind one listener.
                    SocketService.off("appointment_status_changed");
                    SocketService.on("appointment_status_changed", handleAppointmentStatusChanged);
                }
            } catch (error) {
                console.error("Error setting up socket", error);
            }
        };

        setupSocket();

        return () => {
            SocketService.off("appointment_status_changed", handleAppointmentStatusChanged);
            SocketService.disconnect();
        };
    }, [addAppointmentNotification]);

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

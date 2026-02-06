import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home/Home";
import Notifications from "../Notifications/Notifications";
import Activity from "../Activity/Activity";
import Profile from "../Profile/Profile";
import Navbar from "./Navbar";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
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

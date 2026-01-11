import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Landing from "./src/pages/Landing/Landing";
import Login from "./src/pages/Login/Login";
import Register from "./src/pages/Register/Register";
import Home from "./src/pages/Home/Home";
import Profile from "./src/pages/Profile/Profile";
import Notifications from "./src/pages/Notifications/Notifications";
import Activity from "./src/pages/Activity/Activity";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Activity" component={Activity} />
      </Stack.Navigator>
    </NavigationContainer>
     
    </>
  );
}

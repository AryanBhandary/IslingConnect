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
import LostFound from "./src/pages/LostFound/LostFound";
import ReportItem from "./src/pages/LostFound/ReportItem";
import ItemDetail from "./src/pages/LostFound/ItemDetail";
import MyReports from "./src/pages/LostFound/MyReports";
import Chat from "./src/pages/Chat/Chat";
import ChatList from "./src/pages/Chat/ChatList";
import AuthLoading from "./src/pages/Auth/AuthLoading";
import BookPAT from "./src/pages/Appointments/BookPAT";
import BookIT from "./src/pages/Appointments/BookIT";

import MainTabNavigator from "./src/pages/Navbar/MainTabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="AuthLoading" component={AuthLoading} />
          {/* Main Tab Navigator replaces individual screens */}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="LostFound" component={LostFound} />
          <Stack.Screen name="ReportItem" component={ReportItem} options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ headerShown: false }} />
          <Stack.Screen name="MyReports" component={MyReports} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
          <Stack.Screen name="ChatList" component={ChatList} options={{ headerShown: false }} />
          <Stack.Screen name="BookPAT" component={BookPAT} options={{ headerShown: false }} />
          <Stack.Screen name="BookIT" component={BookIT} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>

    </>
  );
}

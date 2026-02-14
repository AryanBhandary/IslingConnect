import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

interface AppLoaderProps {
    variant?: "primary" | "onBlue" | "onWhite";
    size?: "small" | "large";
    message?: string;
    style?: any;
}

const AppLoader: React.FC<AppLoaderProps> = ({
    variant = "primary",
    size = "large",
    message,
    style
}) => {
    let color = "#242FA3"; // Default primary blue

    if (variant === "onBlue") {
        color = "#FFFFFF";
    } else if (variant === "onWhite") {
        color = "#242FA3";
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
            {message && (
                <Text style={[
                    styles.message,
                    { color: variant === "onBlue" ? "#FFF" : "#666" }
                ]}>
                    {message}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    message: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "500",
    },
});

export default AppLoader;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginTop: 20,
    },
    content: {
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
        marginTop: 20,
        marginBottom: 10,
    },
    required: {
        color: "red",
    },
    imageUploadBox: {
        width: "100%",
        height: 180,
        backgroundColor: "#F2F2F2",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#999",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    uploadedImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    input: {
        backgroundColor: "#EBEBEB",
        borderRadius: 15,
        height: 55,
        paddingHorizontal: 15,
        fontSize: 15,
        color: "#000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dateInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 25,
        gap: 12,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderColor: "#333",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
    },
    checkboxText: {
        fontSize: 13,
        color: "#333",
        flex: 1,
        lineHeight: 18,
    },
    reportButton: {
        backgroundColor: "#242FA3",
        borderRadius: 25,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    reportButtonText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default styles;

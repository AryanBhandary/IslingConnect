import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 10,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 20,
        padding: 8,
    },
    imageContainer: {
        width: width,
        height: 350,
        backgroundColor: "#F0F0F0",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    contentScroll: {
        flexGrow: 1,
    },
    content: {
        padding: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#FFFFFF",
        marginTop: -30,
        minHeight: 500,
    },
    badgeContainer: {
        flexDirection: "row",
        marginBottom: 15,
    },
    badge: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
    },
    foundBadge: {
        backgroundColor: "#E8F5E9",
    },
    lostBadge: {
        backgroundColor: "#FFEBEE",
    },
    badgeText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    foundText: {
        color: "#28A745",
    },
    lostText: {
        color: "#FF4d4d",
    },
    itemName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    dateText: {
        fontSize: 16,
        color: "#666",
        marginLeft: 8,
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#F9F9F9",
        padding: 12,
        borderRadius: 15,
    },
    infoText: {
        fontSize: 15,
        color: "#333",
        marginLeft: 12,
        fontWeight: "500",
    },
    uploaderCard: {
        backgroundColor: "#F2F4FF",
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
    },
    uploaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    uploaderInfo: {
        marginLeft: 15,
    },
    uploaderName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    uploaderLabel: {
        fontSize: 13,
        color: "#666",
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    contactText: {
        fontSize: 14,
        color: "#333",
        marginLeft: 10,
    },
    footer: {
        padding: 20,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    chatButton: {
        backgroundColor: "#242FA3",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        borderRadius: 30,
        shadowColor: "#242FA3",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    chatButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    returnSection: {
        marginTop: 30,
        padding: 20,
        backgroundColor: "#F0F4FF",
        borderRadius: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D0D9FF",
    },
    returnTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#242FA3",
        marginBottom: 10,
    },
    qrContainer: {
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 15,
        marginVertical: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    qrCodeText: {
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 5,
        color: "#000",
    },
    qrLabel: {
        fontSize: 12,
        color: "#666",
        marginTop: 10,
    },
    scannerContainer: {
        width: "100%",
        height: 250,
        borderRadius: 20,
        overflow: "hidden",
        marginVertical: 15,
    },
    scanner: {
        flex: 1,
    },
    statusBadge: {
        position: "absolute",
        top: 20,
        right: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        zIndex: 10,
    },
    statusText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 12,
    },
});

export default styles;

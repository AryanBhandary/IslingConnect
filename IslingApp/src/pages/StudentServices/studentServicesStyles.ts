import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#000",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#d9d9d9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  cardHeaderText: {
    flex: 1,
  },
  departmentName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
    marginRight: 40,
  },
  downloadButton: {
    backgroundColor: "#5a67ff",
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  downloadButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  requestButton: {
    backgroundColor: "#1a237e",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  requestButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontSize: 16,
  },
});

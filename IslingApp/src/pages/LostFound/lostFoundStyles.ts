import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  filterOptions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 15,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  activeFilterChip: {
    backgroundColor: "#242FA3",
    borderColor: "#242FA3",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterChipText: {
    color: "#FFF",
    fontWeight: "600",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroSection: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  lostButton: {
    borderWidth: 1,
    borderColor: "#FF0000",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "120%"
  },
  lostButtonText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "bold",
  },
  foundButton: {
    borderWidth: 1,
    borderColor: "#28A745",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "120%"
  },
  foundButtonText: {
    color: "#28A745",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  listContainer: {
    width: "100%",
    marginTop: 20,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    overflow: "hidden",
    height: 140,
    width: "100%"
  },
  imageContainer: {
    width: 120,
    height: "100%",
    position: "relative",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
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
  detailsContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
    fontWeight: "500",
  },
  chatButtonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 25,
    paddingVertical: 10,
    width: "100%",
  },
  chatButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default styles;

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  container: {
    paddingTop: 210,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    color: "#C6C6C6",
    marginTop: 10,
    textAlign: "left",
  },
  greeting: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center", 
  },
  greetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 8,
  },
  greetSubtitle: {
    fontSize: 14,
    fontWeight: "light",
  },
  departList: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 43,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: "#BCBCBC"
  },
  options: {
    maxWidth: 65,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    textAlign: "center",
    fontWeight: "semibold",
    fontSize: 14,
  },
  icon: {
    width: 65,
    height: 65,
    marginBottom: 5,
    resizeMode: "cover",
    borderRadius: "50%",
  },
});

export default styles;

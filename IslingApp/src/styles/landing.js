import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "black",
    opacity: 0.45,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 80,
    paddingHorizontal: 20,
    marginTop: 25,
  },
  heading: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: 700,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    opacity: 0.75,
    marginBottom: 10,
  },
  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D289C",
    paddingVertical: 12,
    width: 380,
    borderRadius: 24,
    marginBottom: 20,
  },
  signupButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D289C",
    paddingVertical: 12,
    width: 380,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 500,
    color: "white",
  },
});

export default styles;

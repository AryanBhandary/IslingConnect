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
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  heading: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
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

  back: {
    top: 50,
    left: 30,
    color: "blue",
    fontSize: 20,
    fontWeight: 500,
  },
  form: {
    width: 380,
    top: 10,
  },
  formTitle: {
    textAlign: 'center',
    color: "#A0A0A0",
    fontSize: 24,
    fontWeight: 700,
  },
  formSubtitle: {
    textAlign: 'center',
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 30,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    color: "#fff",
  },
  loginBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D289C",
    paddingVertical: 12,
    width: 380,
    borderRadius: 24,
  },
  loginText: {
    fontSize: 20,
    fontWeight: 500,
    color: "white",
  },
});

export default styles;

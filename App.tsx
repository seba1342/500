import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Animated500 from "./components/Animated500";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Animated500 />
      <Text style={styles.tagline}>A game of cards.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    color: "#222",
    fontSize: 18,
    paddingTop: 16,
  },
});

// src/App.jsx

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import useMetro from "../hooks/useMetro";

const App = () => {
  const { isPlaying, tempo, togglePlay, increaseTempo, decreaseTempo } =
    useMetro();

  return (
    <View style={styles.container}>
      <Button title={isPlaying ? "Stop" : "Play"} onPress={togglePlay} />
      <Text style={styles.tempoText}>Tempo: {tempo} BPM</Text>
      <View style={styles.controls}>
        <Button title="-" onPress={decreaseTempo} />
        <Button title="+" onPress={increaseTempo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tempoText: {
    fontSize: 24,
    marginVertical: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
  },
});

export default App;

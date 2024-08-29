// src/hooks/useMetro.js

import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";

const useMetro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(250); // Default tempo in beats per minute (BPM)
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load the sound when the component mounts
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/click.mp3")
      );
      soundRef.current = sound;
    };

    loadSound();

    // Cleanup function to unload the sound when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      // Calculate the interval in milliseconds based on the tempo
      const interval = 60000 / tempo;

      // Start the metronome
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          soundRef.current.replayAsync();
        }
      }, interval);
    } else {
      // Stop the metronome
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on component unmount or when `isPlaying` changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, tempo]);

  // Function to toggle play/pause
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Function to increase the tempo
  const increaseTempo = () => {
    setTempo((prev) => Math.min(prev + 1, 300)); // Max tempo set to 300 BPM
  };

  // Function to decrease the tempo
  const decreaseTempo = () => {
    setTempo((prev) => Math.max(prev - 1, 30)); // Min tempo set to 30 BPM
  };

  return {
    isPlaying,
    tempo,
    togglePlay,
    increaseTempo,
    decreaseTempo,
  };
};

export default useMetro;

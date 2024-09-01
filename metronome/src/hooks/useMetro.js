import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";

const useMetro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120); // Default tempo in beats per minute (BPM)
  const soundRef = useRef(null);
  const nextTickTimeRef = useRef(0); // To keep track of the next scheduled tick
  const lookahead = 0.1; // How far ahead to schedule audio (in seconds)

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/click.mp3"), // Ensure you have the correct path to your sound file
        { shouldPlay: false }
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playClick = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
    }
  };

  let now = Date.now();
  function deb(time) {
    console.log(time - now);
    now = time;
  }

  const scheduleClick = async () => {
    const secondsPerBeat = 60.0 / tempo;
    const currentTime = Date.now() / 1000; // Convert to seconds
    while (nextTickTimeRef.current < currentTime + lookahead) {
      await playClick();
      deb(Date.now());
      nextTickTimeRef.current += secondsPerBeat;
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      nextTickTimeRef.current = Date.now() / 1000 + 0.1; // Start after a short delay
      interval = setInterval(scheduleClick, lookahead * 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, tempo]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const increaseTempo = () => {
    setTempo((prev) => Math.min(prev + 1, 300)); // Max tempo set to 300 BPM
  };

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

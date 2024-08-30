import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";

const useMetro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120); // Default tempo in beats per minute (BPM)
  const soundRef = useRef(null);
  const timeoutRef = useRef(null);
  const nextTickTimeRef = useRef(0); // To keep track of the next scheduled tick
  const lookahead = 25; // How often to call scheduling function (in ms)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)

  useEffect(() => {
    // Load the sound when the component mounts
    const loadSound = async () => {
      await Audio.setIsEnabledAsync(true); // Ensure audio is enabled
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/click.mp3"),
        { shouldPlay: false, isLooping: false }
      );
      soundRef.current = sound;
    };

    loadSound();

    // Cleanup function to unload the sound when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scheduleNote = (time) => {
    if (soundRef.current) {
      // Play the sound with slight delay to match scheduled time
      const playAtTime = time - Audio.getStatusAsync().positionMillis / 1000;
      if (playAtTime > 0) {
        setTimeout(() => soundRef.current.replayAsync(), playAtTime * 1000);
      } else {
        soundRef.current.replayAsync();
      }
    }
  };

  const scheduler = () => {
    while (
      nextTickTimeRef.current <
      Audio.getStatusAsync().positionMillis / 1000 + scheduleAheadTime
    ) {
      scheduleNote(nextTickTimeRef.current);
      nextNote();
    }
    timeoutRef.current = setTimeout(scheduler, lookahead);
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / tempo; // Calculate the duration of one beat
    nextTickTimeRef.current += secondsPerBeat; // Advance the time for the next note
  };

  useEffect(() => {
    if (isPlaying) {
      nextTickTimeRef.current = Audio.getStatusAsync().positionMillis / 1000;
      scheduler();
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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

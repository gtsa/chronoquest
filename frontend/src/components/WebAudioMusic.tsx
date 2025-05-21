// src/components/WebAudioMusic.tsx
import { useEffect, useRef } from "react";

interface WebAudioMusicProps {
  musicOn: boolean; // Prop to control whether music should be playing
}

const WebAudioMusic: React.FC<WebAudioMusicProps> = ({ musicOn }) => {
  // Refs to manage audio context and playback state
  const contextRef = useRef<AudioContext | null>(null);       // Main Web Audio context
  const bufferRef = useRef<AudioBuffer | null>(null);         // Decoded audio data
  const sourceRef = useRef<AudioBufferSourceNode | null>(null); // Current playing source node
  const gainRef = useRef<GainNode | null>(null);              // Gain node for volume control
  const startTimeRef = useRef<number>(0);                     // When playback started
  const pauseOffsetRef = useRef<number>(0);                   // How far into the track we were when paused

  // Load and decode the audio buffer on mount or musicOn toggle
  useEffect(() => {
    // 1. Create audio context if not already created
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      (window as any).__chronoquestAudioContext__ = contextRef.current; // Expose for manual debugging
    }

    const context = contextRef.current;

    // 2. If audio buffer not yet loaded, fetch and decode it
    if (!bufferRef.current) {
      fetch("/chronoquest_music_theme.mp3")
        .then((res) => res.arrayBuffer())              // Fetch as binary
        .then((data) => context.decodeAudioData(data)) // Decode to Web Audio buffer
        .then((decoded) => {
          bufferRef.current = decoded;                 // Save decoded buffer
          if (musicOn) {
            playFromOffset();                          // Play immediately if music should be on
          }
        })
        .catch((err) => console.error("Failed to load audio:", err));
    } else {
      // 3. If buffer is already loaded, play or pause based on `musicOn`
      musicOn ? playFromOffset() : pauseMusic();
    }

    // 4. Cleanup audio on component unmount
    return () => pauseMusic();
  }, [musicOn]);

  // Handle visibility/focus events to pause/resume music appropriately
  useEffect(() => {
    const handlePause = () => pauseMusic();          // Pause when window loses focus
    const handleResume = () => {
      if (musicOn) playFromOffset();                 // Resume music if musicOn is true
    };

    document.addEventListener("visibilitychange", () => {
      document.hidden ? handlePause() : handleResume();
    });

    window.addEventListener("blur", handlePause);
    window.addEventListener("focus", handleResume);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("visibilitychange", () => {});
      window.removeEventListener("blur", handlePause);
      window.removeEventListener("focus", handleResume);
    };
  }, [musicOn]);

  // Resume or start music from a saved offset (e.g., after pause)
  const playFromOffset = () => {
    const context = contextRef.current;
    const buffer = bufferRef.current;
    if (!context || !buffer) return;

    pauseMusic(); // Stop any currently playing audio to avoid overlaps

    // 1. Create a new source node and gain node
    const source = context.createBufferSource();
    const gain = context.createGain();

    // 2. Assign buffer and set loop mode
    source.buffer = buffer;
    source.loop = true;

    // 3. Set initial volume level
    gain.gain.setValueAtTime(0.05, context.currentTime); // 5% volume

    // 4. Connect source → gain → speakers
    source.connect(gain);
    gain.connect(context.destination);

    // 5. Clamp negative offsets to zero to avoid crash
    const safeOffset = Math.max(0, pauseOffsetRef.current || 0);

    try {
      source.start(0, safeOffset); // Start playback from offset
    } catch (err) {
      console.error("Audio start error:", err);
      return;
    }

    // 6. Record when playback started for later pause offset
    startTimeRef.current = context.currentTime - safeOffset;

    // 7. Save references for later stop/resume
    sourceRef.current = source;
    gainRef.current = gain;
  };

  // Pause music playback and save the offset
  const pauseMusic = () => {
    const context = contextRef.current;
    const source = sourceRef.current;
    if (!context || !source) return;

    // 1. Calculate time elapsed since start
    const elapsed = context.currentTime - startTimeRef.current;
    pauseOffsetRef.current = Math.max(0, elapsed); // Clamp to 0

    try {
      source.stop();        // Stop the audio
      source.disconnect();  // Disconnect from gain node
    } catch (err) {
      console.warn("Audio stop error:", err);
    }

    sourceRef.current = null; // Clear ref
  };

  // This component doesn't render any UI, it's purely for audio
  return null;
};

export default WebAudioMusic;

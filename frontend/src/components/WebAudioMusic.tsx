// src/components/WebAudioMusic.tsx
import { useEffect, useRef } from "react";

interface WebAudioMusicProps {
  musicOn: boolean;
}

const WebAudioMusic: React.FC<WebAudioMusicProps> = ({ musicOn }) => {
  const contextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);

  // Load and decode the audio buffer once
  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const context = contextRef.current;

    if (!bufferRef.current) {
      fetch("/chronoquest_music_theme.mp3")
        .then((res) => res.arrayBuffer())
        .then((data) => context.decodeAudioData(data))
        .then((decoded) => {
          bufferRef.current = decoded;
          if (musicOn) {
            playFromOffset();
          }
        })
        .catch((err) => console.error("Failed to load audio:", err));
    } else if (musicOn) {
      playFromOffset();
    } else {
      pauseMusic();
    }

    // Cleanup on unmount
    return () => {
      pauseMusic();
    };
  }, [musicOn]);

  // Visibility handling
  useEffect(() => {
    const handlePause = () => {
      pauseMusic();
    };
  
    const handleResume = () => {
      if (musicOn) {
        playFromOffset();
      }
    };
  
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) handlePause();
      else handleResume();
    });
  
    window.addEventListener("blur", handlePause);
    window.addEventListener("focus", handleResume);
  
    return () => {
      document.removeEventListener("visibilitychange", () => {});
      window.removeEventListener("blur", handlePause);
      window.removeEventListener("focus", handleResume);
    };
  }, [musicOn]);
  

  contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    (window as any).__chronoquestAudioContext__ = contextRef.current;


  const playFromOffset = () => {
    const context = contextRef.current;
    const buffer = bufferRef.current;

    if (!context || !buffer) return;

    pauseMusic(); // Ensure old source is cleaned

    const source = context.createBufferSource();
    const gain = context.createGain();

    source.buffer = buffer;
    source.loop = true;

    gain.gain.setValueAtTime(0.05, context.currentTime);

    source.connect(gain);
    gain.connect(context.destination);

    source.start(0, pauseOffsetRef.current);

    startTimeRef.current = context.currentTime - pauseOffsetRef.current;

    sourceRef.current = source;
    gainRef.current = gain;
  };

  const pauseMusic = () => {
    const context = contextRef.current;
    const source = sourceRef.current;

    if (context && source) {
      pauseOffsetRef.current = context.currentTime - startTimeRef.current;
      source.stop();
      source.disconnect();
      sourceRef.current = null;
    }
  };

  return null;
};

export default WebAudioMusic;

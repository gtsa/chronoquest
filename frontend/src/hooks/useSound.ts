import { useCallback } from "react";

export const useSound = (soundOn: boolean = true) => {
  const playSound = useCallback((filename: string) => {
    if (!soundOn) return;

    const audio = new Audio(`/sounds/${filename}`);
    audio.volume = 0.5;
    audio.play();
  }, [soundOn]);

  return { playSound };
};

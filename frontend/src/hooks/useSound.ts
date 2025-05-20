import { useCallback } from "react";

export const useSound = () => {
  const playSound = useCallback((filename: string) => {
    const audio = new Audio(`/sounds/${filename}`);
    audio.volume = 0.5;
    audio.play();
  }, []);

  return { playSound };
};

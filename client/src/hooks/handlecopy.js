import { useState } from "react";
import { useTicTacToe } from "./useTicTacToe";
export const useClipboard = () => {
  const { passcode } = useTicTacToe();
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopy = () => {
    if (passcode) {
      navigator.clipboard.writeText(passcode);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000); // Reset message after 2 seconds
    }
  };

  return { copySuccess, handleCopy };
};

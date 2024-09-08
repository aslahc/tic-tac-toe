import { useState } from "react";
import { useTicTacToe } from "./useTicTacToe"; // Import custom hook for TicTacToe logic

export const useClipboard = () => {
  const { passcode } = useTicTacToe(); // Get the current game passcode from the TicTacToe hook
  const [copySuccess, setCopySuccess] = useState(""); // State to track copy success message

  // Function to handle copying the passcode to the clipboard
  const handleCopy = () => {
    if (passcode) {
      navigator.clipboard.writeText(passcode); // Copy the passcode to the clipboard
      setCopySuccess("Copied!"); // Set success message
      setTimeout(() => setCopySuccess(""), 2000); // Reset success message after 2 seconds
    }
  };

  // Return the copy success message and the handleCopy function
  return { copySuccess, handleCopy };
};

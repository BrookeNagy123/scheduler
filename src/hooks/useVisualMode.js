import { useState } from "react";

//Custom hook to transition or go back between different modes.
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(prev => ([...prev.slice(0, prev.length - 1), newMode]));
      setMode(newMode);
      return;
    } else {
      setMode(newMode);
      setHistory(prev => ([...prev, newMode]));
    }
  };
  const back = () => {
    if (history.length <= 1) {
      setMode(history[0]);
    } else {
      let newHistory = [...history]
      newHistory.pop();
      setHistory(newHistory)
      setMode(newHistory[newHistory.length - 1]);
    }
  };
  return {mode, transition, back};
}

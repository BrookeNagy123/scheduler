import { useState } from "react";

//Custom hook to transition or go back between different modes. 
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition(mode, replace = false) {
    if (replace === true) {
      setHistory(prev => ([...prev.slice(0, prev.length - 1), mode]));
      setMode(mode);
      return;
    } else {
      setMode(mode);
      setHistory(prev => ([...prev, mode]));
    }
  }
  function back() {
    if (history.length <= 1) {
      setMode(history[0]);
    } else {
      history.pop();
      setMode(history[history.length - 1]);
    }
  }
  return {mode, transition, back};
}

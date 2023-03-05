import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);
  function transition (mode, replace = false) {
    if(replace === true){
     setMode(history.pop())
    }
    setMode(mode)
    history.push(mode)
    }
  function back (){
    if(history.length === 1){
      setMode(history[0])
    } else {
    history.pop()
    setMode(history[history.length - 1]) 
    }
  }
  return {mode, transition, back};
}
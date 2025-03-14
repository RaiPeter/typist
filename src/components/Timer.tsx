"use client";
import { useState, useEffect } from "react";
import "./Timer.css";
interface TimerProps {
  mode: "time" | "words" | "quote" | "zen" | "custom";
  startTime: number | null;
  duration: number;
  isCompleted: boolean;
  setIsCompleted: (isCompleted: boolean) => void;
}

const Timer = ({
  mode,
  startTime,
  duration,
  isCompleted,
  setIsCompleted,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "time" && startTime && !isCompleted) {
      setIsTimerActive(true);
      timer = setInterval(() => {
        const elapsed = Math.floor(Date.now() - startTime) / 1000;
        const remaining = duration - Math.floor(elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          setIsCompleted(true);
          setIsTimerActive(false);
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, mode, duration, isCompleted, setIsCompleted]);

  return mode === "time" && !isCompleted && isTimerActive ? (
    <div
      className="timer"
      style={{
        visibility: isCompleted && isTimerActive ? "visible" : "hidden",
      }}
    >
      {timeLeft}
    </div>
  ) : null;
};

export default Timer;

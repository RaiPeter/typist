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
    if (!startTime || isCompleted) {
      setTimeLeft(duration);
      setIsTimerActive(false);
      return;
    }

    if (mode === "time" && startTime && !isCompleted) {
      setIsTimerActive(true);
      const timer = setInterval(() => {
        const elapsed = Math.floor(Date.now() - startTime) / 1000;
        const remaining = duration - Math.floor(elapsed);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          setIsCompleted(true);
          setIsTimerActive(false);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, mode, duration, isCompleted, setIsCompleted]);

  return (
    <div
      className="timer"
      style={{
        visibility:
          mode === "time" && !isCompleted && isTimerActive
            ? "visible"
            : "hidden",
      }}
    >
      {timeLeft}
    </div>
  );
};

export default Timer;

"use client";
import React from "react";
import "./WordProgress.css";

interface WordProgressProps {
  completedWords: number;
  totalWords: number;
  startTime: number | null;
}

const WordProgress: React.FC<WordProgressProps> = ({
  completedWords,
  totalWords,
  startTime,
}) => {
  return (
    <div className="wordProgress" style={{
        visibility:
        startTime && completedWords < totalWords ? "visible" : "hidden",
      }}>
      {completedWords}/{totalWords}
    </div>
  );
};

export default WordProgress;
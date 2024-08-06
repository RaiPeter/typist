"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  let [typingString, setTypingString] = useState(
    "agent cap this is the world we live of same origin quest table rainbow fall dog sick figure"
  );
  const [typedString, setTypedString] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");

  // const currentWord = typingString.split(" ")[currentWordIndex];

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === " " || e.key === "Space") {
        console.log("hello");
        setCurrentWordIndex((prev) => prev + 1);
        setTypedString((prev) => prev + " ");
        setCurrentLetterIndex(0);
      } else {
        let currentWord = typingString.split(" ")[currentWordIndex];
        console.log(currentWord); //agent

        const expectedLetter = currentWord[currentLetterIndex];
        console.log(expectedLetter);

        setTypedString((prev) => prev + e.key);
        console.log("typed", typedString);
        setCurrentLetterIndex((prev) => prev + 1);
        console.log("letterIndex", currentLetterIndex);
      }
      // if (currentWordIndex + 1 >= currentWord.length) {
      //   setCurrentWordIndex((prev) => prev + 1);
      //   setCurrentLetterIndex(0);
      // }
      // setCurrentCharacter(e.key);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [typingString, typedString,currentWord, currentWordIndex, currentLetterIndex]);

  const getStyledString = (word: string,wordIndex:number) => {
    return word.split("").map((letter, index) => {
      const typedWord = typedString.split(" ")[wordIndex] || "";
      const typedLetter = typedWord[index];
      const isCorrect = letter === typedLetter;
      console.log("icorect",isCorrect);
      
      const isCurrent = wordIndex === currentWordIndex && index === currentLetterIndex;

      return (
        <span
          key={letter + index}
          className={`${styles.letter} ${
            isCorrect ? styles.right : styles.wrong
          } ${isCurrent ? styles.current : ""}`}
        >
          {letter}
        </span>
      );
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.test_area}>
        {typingString?.split(" ").map((word, i) => (
          <div className={styles.word} key={word + i}>
            {getStyledString(word,i)}
          </div>
        ))}
      </div>
    </main>
  );
}

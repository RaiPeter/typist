"use client";
import { useState, useEffect } from "react";
import styles from "./typing.module.css";

interface WordProps {
  word: string;
  wordIndex: number;
  typedWords: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  isCompleted: boolean;
}

interface LetterProps {
  letter: string;
  index: number;
  typedWord: string;
  isCurrent: boolean;
  isLastLetter: boolean;
  isCaretAfterWord: boolean; // Add this prop to control caret after word
}

export default function Typing() {
  const originalText: string = "the quick brown fox jump asd asdf as dfasdfasd fasdf asd asd fasdf asd s over the lazy dog";
  const words: string[] = originalText.split(" ");

  const [typedText, setTypedText] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const currentWord: string = words[currentWordIndex];

      if (!startTime && e.key.length === 1) {
        setStartTime(Date.now());
      }

      if (e.key === " ") {
        if (currentLetterIndex > 0 && currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prev) => prev + 1);
          setTypedText((prev) => prev.trim() + " ");
          setCurrentLetterIndex(0);
        } else if (
          currentWordIndex === words.length - 1 &&
          currentLetterIndex > 0
        ) {
          setIsCompleted(true);
        }
      } else if (e.key === "Backspace") {
        if (e.ctrlKey) {
          if (currentWordIndex > 0 && typedText.endsWith(" ")) {
            const prevWord: string = words[currentWordIndex - 1];
            setTypedText((prev) => {
              const wordsArray = prev.split(" ");
              wordsArray.pop();
              wordsArray.pop();
              return wordsArray.join(" ") + (wordsArray.length > 0 ? " " : "");
            });
            setCurrentWordIndex((prev) => prev - 1);
            setCurrentLetterIndex(0);
          } else if (currentLetterIndex > 0) {
            setTypedText((prev) => {
              const wordsArray = prev.split(" ");
              wordsArray[currentWordIndex] = "";
              return wordsArray.join(" ").trim();
            });
            setCurrentLetterIndex(0);
          }
        } else {
          if (currentLetterIndex > 0) {
            setTypedText((prev) => prev.slice(0, -1));
            setCurrentLetterIndex((prev) => prev - 1);
          } else if (currentWordIndex > 0 && typedText.endsWith(" ")) {
            setCurrentWordIndex((prev) => prev - 1);
            setTypedText((prev) => prev.trim().slice(0, -1));
            const prevWord: string = words[currentWordIndex - 1];
            setCurrentLetterIndex(prevWord.length);
          }
        }
      } else if (
        e.key.length === 1 &&
        currentLetterIndex < currentWord.length
      ) {
        const expectedLetter: string = currentWord[currentLetterIndex];
        if (e.key !== expectedLetter) {
          setErrors((prev) => prev + 1);
        }
        setTypedText((prev) => prev + e.key);
        setCurrentLetterIndex((prev) => prev + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentWordIndex, currentLetterIndex, startTime, words]);

  useEffect(() => {
    console.log({ typedText, currentWordIndex, currentLetterIndex });
  }, [typedText, currentWordIndex, currentLetterIndex]);

  const renderLetter = ({
    letter,
    index,
    typedWord,
    isCurrent,
    isLastLetter,
    isCaretAfterWord,
  }: LetterProps) => {
    const typedLetter: string | undefined = typedWord[index];
    const isTyped: boolean = index < typedWord.length;
    const isCorrect: boolean = isTyped && letter === typedLetter;

    return (
      <span
        key={`${letter}-${index}`}
        className={`${styles.letter} ${
          isTyped ? (isCorrect ? styles.correct : styles.incorrect) : ""
        }`}
      >
        {isCurrent && <span className={styles.caret}>|</span>}
        {letter}
        {isLastLetter && isCaretAfterWord && (
          <span className={styles.caretAfter}>|</span>
        )}
      </span>
    );
  };

  const renderWord = ({
    word,
    wordIndex,
    typedWords,
    currentWordIndex,
    currentLetterIndex,
    isCompleted,
  }: WordProps) => {
    const typedWord: string = typedWords[wordIndex] || "";
    const isCaretAfterWord: boolean =
      wordIndex === currentWordIndex &&
      currentLetterIndex === word.length &&
      !isCompleted;

    return word.split("").map((letter, index) => {
      const isCurrent: boolean =
        wordIndex === currentWordIndex &&
        index === currentLetterIndex &&
        !isCompleted &&
        currentLetterIndex < word.length;
      const isLastLetter: boolean = index === word.length - 1;

      return renderLetter({
        letter,
        index,
        typedWord,
        isCurrent,
        isLastLetter,
        isCaretAfterWord,
      });
    });
  };

  const calculateWPM = (): number => {
    if (!startTime || !isCompleted) return 0;
    const timeElapsed: number = (Date.now() - startTime) / 60000;
    const correctWords: number = typedText
      .split(" ")
      .filter((word, i) => word === words[i]).length;
    return Math.round(correctWords / timeElapsed);
  };

  const resetTest = (): void => {
    setTypedText("");
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setStartTime(null);
    setErrors(0);
    setIsCompleted(false);
  };

  const typedWords: string[] = typedText
    .split(" ")
    .filter((word) => word.length > 0);

  return (
    <div className={styles.container}>
      {!isCompleted ? (
        <div className={styles.text}>
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className={styles.word}>
              {renderWord({
                word,
                wordIndex: i,
                typedWords,
                currentWordIndex,
                currentLetterIndex,
                isCompleted,
              })}
            </span>
          ))}
        </div>
      ) : (
        <div className={styles.results}>
          <h2>Test Completed!</h2>
          <p>WPM: {calculateWPM()}</p>
          <p>Errors: {errors}</p>
          <p>
            Accuracy:{" "}
            {typedText.length > 0
              ? Math.round(
                  ((typedText.length - errors) / typedText.length) * 100
                )
              : 0}
            %
          </p>
          <button onClick={resetTest}>Restart</button>
        </div>
      )}
    </div>
  );
}

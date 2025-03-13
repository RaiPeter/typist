"use client";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./typing.module.css";
import { RiResetRightLine } from "react-icons/ri";

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

interface TypingProps {
  text: string;
  mode: "time" | "words" | "quote" | "zen" | "custom";
  duration: number;
  modeBarRef: React.RefObject<HTMLDivElement>;
  footerLinkRef: React.RefObject<HTMLDivElement>;
}

export default function Typing({
  text,
  mode,
  duration,
  modeBarRef,
  footerLinkRef,
}: TypingProps) {
  const words: string[] = text.split(" ");
  console.log("Typing Component - Received Text:", text);
  console.log("Typing Component - Words Array:", words);

  const [typedText, setTypedText] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [errors, setErrors] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isBlurred, setIsBlurred] = useState<boolean>(false);

  // ref for container
  const textContainerRef = useRef<HTMLDivElement>(null);
  // ref for each word
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    resetTest();
  }, [text, mode]);

  // timer for time mode
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
  }, [startTime, mode, duration, isCompleted]);

  // auto scroll
  useLayoutEffect(() => {
    console.log("Auto-scroll triggered for word index:", currentWordIndex);
    console.log("Word ref:", wordRefs.current[currentWordIndex]);
    console.log("Text container ref:", textContainerRef.current);
    if (wordRefs.current[currentWordIndex] && textContainerRef.current) {
      console.log("Scrolling to word:", words[currentWordIndex]);
      wordRefs.current[currentWordIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      console.log("Cannot scroll: Word ref or container ref is missing");
    }
  }, [currentWordIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if the click is inside the text container
      const isClickInsideText =
        textContainerRef.current && textContainerRef.current.contains(target);

      // Check if the click is inside the mode bar
      const isClickInsideModeBar =
        modeBarRef.current && modeBarRef.current.contains(target);
      const isClickInsideFooterLink =
        footerLinkRef.current && footerLinkRef.current.contains(target);

      if (isClickInsideText) {
        console.log("Click inside text container, removing blur");
        setIsBlurred(false);
      } else if (isClickInsideModeBar || isClickInsideFooterLink) {
        console.log("Click inside mode bar, not applying blur");
      } else {
        console.log("Click outside, applying blur");
        setIsBlurred(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (isCompleted) return;

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
          currentLetterIndex > 0 &&
          mode !== "time"
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
  }, [currentWordIndex, currentLetterIndex, startTime, words, isCompleted]);

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
    if (!word) return null;
    const typedWord: string = typedWords[wordIndex] || "";
    const isCaretAfterWord: boolean =
      wordIndex === currentWordIndex &&
      currentLetterIndex === word.length &&
      !isCompleted;

    return (
      <span
        ref={(el) => {
          wordRefs.current[wordIndex] = el;
        }}
        className={styles.word}
        key={wordIndex}
      >
        {word.split("").map((letter, index) => {
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
        })}
      </span>
    );
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
    setTimeLeft(duration);
    setErrors(0);
    setIsCompleted(false);
    setIsTimerActive(false);
    wordRefs.current = Array(words.length).fill(null);
  };

  const typedWords: string[] = typedText
    .split(" ")
    .filter((word) => word.length > 0);

  return (
    <div className={styles.container}>
      {mode === "time" && (
        <div
          className={styles.timer}
          style={{
            visibility: !isCompleted && isTimerActive ? "visible" : "hidden",
          }}
        >
          {timeLeft}
        </div>
      )}
      {!isCompleted ? (
        words.length > 0 ? (
          <>
            <div
              className={`${styles.text} ${isBlurred ? styles.blurred : ""}`}
              ref={textContainerRef}
            >
              {words.map((word, i) =>
                renderWord({
                  word,
                  wordIndex: i,
                  typedWords,
                  currentWordIndex,
                  currentLetterIndex,
                  isCompleted,
                })
              )}
            </div>
            <button className={styles.resetButton} onClick={resetTest}>
              <RiResetRightLine />
            </button>
          </>
        ) : (
          <div>No text to type. Please select a mode.</div>
        )
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
          <button className={styles.resetButton} onClick={resetTest}>
            <RiResetRightLine />
          </button>
        </div>
      )}
    </div>
  );
}

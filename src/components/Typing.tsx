"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import styles from "./typing.module.css";
import { RiResetRightLine } from "react-icons/ri";
import Results from "./Results";
import Timer from "./Timer";
import WordProgress from "./WordProgress";

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
  isCaretAfterWord: boolean;
}

interface TypingProps {
  text: string;
  mode: "time" | "words" | "quote" | "zen" | "custom";
  duration: number;
  modeBarRef: React.RefObject<HTMLDivElement>;
  footerLinkRef: React.RefObject<HTMLDivElement>;
  onTestActiveChange?: (isActive: boolean) => void;
  onResetText?: () => string;
}

const TextContainerComponent: React.FC<{
  words: string[];
  typedWords: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  isCompleted: boolean;
  isBlurred: boolean;
  textContainerRef: React.RefObject<HTMLDivElement>;
  wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  renderWord: (props: WordProps) => JSX.Element | null;
}> = ({
  words,
  typedWords,
  currentWordIndex,
  currentLetterIndex,
  isCompleted,
  isBlurred,
  textContainerRef,
  wordRefs,
  renderWord,
}) => {
  return (
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
  );
};

const TextContainer = React.memo(TextContainerComponent);

export default function Typing({
  text,
  mode,
  duration,
  modeBarRef,
  footerLinkRef,
  onTestActiveChange,
  onResetText,
}: TypingProps) {
  const words: string[] = text.split(" ");
  const totalWords: number = words.length;
  console.log("Typing Component - Received Text:", text);
  console.log("Typing Component - Words Array:", words);

  const [typedText, setTypedText] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isBlurred, setIsBlurred] = useState<boolean>(false);
  const [isTabPressed, setIsTabPressed] = useState<boolean>(false);
  const [finalWPM, setFinalWPM] = useState<number>(0);
  const [completedWords, setCompletedWords] = useState<number>(0);
  const [currentWordErrors, setCurrentWordErrors] = useState<number>(0);

  // ref for container
  const textContainerRef = useRef<HTMLDivElement>(null);
  // ref for each word
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if the test is active
  const isTestActive = !!startTime && !isCompleted;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile && inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
  }, [isMobile, isCompleted]);

  const handleContainerClick = () => {
    if (isMobile && inputRef.current && !isCompleted && !isTestActive) {
      inputRef.current.focus();
    }
  };

  // Notify parent when test active state changes
  useEffect(() => {
    onTestActiveChange?.(isTestActive);
  }, [isTestActive, onTestActiveChange]);

  useEffect(() => {
    wordRefs.current = Array(words.length).fill(null);
    resetTest();
  }, [text, mode]);

  const handleAutoScroll = useCallback(() => {
    if (wordRefs.current[currentWordIndex] && textContainerRef.current) {
      wordRefs.current[currentWordIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentWordIndex]);

  // auto scroll
  useLayoutEffect(() => {
    handleAutoScroll();
  }, [handleAutoScroll]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
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
        if (isMobile && inputRef.current) {
          inputRef.current.focus(); // Re-focus input on mobile
        }
      } else if (isClickInsideModeBar || isClickInsideFooterLink) {
        // nothing
      } else {
        setIsBlurred(true);
      }
    },
    [modeBarRef, footerLinkRef, isMobile]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (isCompleted) return;

      // Track Tab key press
      if (e.key === "Tab") {
        setIsTabPressed(true);
        return; // Exit early to avoid processing other keys yet
      }

      // Reset test when Tab + Enter are pressed
      if (e.key === "Enter" && isTabPressed) {
        console.log("Tab + Enter detected, resetting test");
        resetTest(true);
        setIsTabPressed(false); // Reset Tab state after reset
        return;
      }

      // Reset Tab state if Enter is pressed without Tab
      if (e.key === "Enter" && !isTabPressed) {
        setIsTabPressed(false);
      }

      const currentWord: string = words[currentWordIndex];
      const typedWordsArray: string[] = typedText.trim().split(" ");

      if (!startTime && e.key.length === 1) {
        setStartTime(Date.now());
      }

      if (e.key === " ") {
        if (currentLetterIndex > 0 && currentWordIndex < words.length - 1) {
          const typedWord = typedWordsArray[currentWordIndex] || "";
          let wordErrors = 0;
          for (let i = 0; i < currentWord.length; i++) {
            if (typedWord[i] && typedWord[i] !== currentWord[i]) {
              wordErrors++;
            }
          }
          // Add extra characters as errors if typedWord is longer
          if (typedWord.length > currentWord.length) {
            wordErrors += typedWord.length - currentWord.length;
          }
          setErrors((prev) => prev + wordErrors);
          setCurrentWordErrors(0);

          setCurrentWordIndex((prev) => prev + 1);
          setTypedText((prev) => prev.trim() + " ");
          setCurrentLetterIndex(0);

          // Update completed words
          const completed = typedWordsArray
            .slice(0, currentWordIndex + 1)
            .filter((typedWord, i) => typedWord === words[i]).length;
          setCompletedWords(completed);
        } else if (
          currentWordIndex === words.length - 1 &&
          currentLetterIndex > 0 &&
          mode !== "time"
        ) {
          // Finalize errors for the last word when test completes
          const typedWord = typedWordsArray[currentWordIndex] || "";
          let wordErrors = 0;
          for (let i = 0; i < currentWord.length; i++) {
            if (typedWord[i] && typedWord[i] !== currentWord[i]) {
              wordErrors++;
            }
          }
          if (typedWord.length > currentWord.length) {
            wordErrors += typedWord.length - currentWord.length;
          }
          setErrors((prev) => prev + wordErrors);
          setCurrentWordErrors(0);

          setIsCompleted(true);
          setCompletedWords(totalWords);
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
            setCurrentWordErrors(0);

            // Recalculate completed words
            const completed = typedWordsArray
              .slice(0, currentWordIndex)
              .filter((typedWord, i) => typedWord === words[i]).length;
            setCompletedWords(completed);
          } else if (currentLetterIndex > 0) {
            setTypedText((prev) => {
              const wordsArray = prev.split(" ");
              wordsArray[currentWordIndex] = "";
              return wordsArray.join(" ").trim();
            });
            setCurrentLetterIndex(0);
            setCurrentWordErrors(0);
          }
        } else {
          if (currentLetterIndex > 0) {
            const lastTypedChar = typedText[typedText.length - 1];
            const expectedChar = currentWord[currentLetterIndex - 1];
            if (lastTypedChar !== expectedChar && currentWordErrors > 0) {
              setCurrentWordErrors((prev) => prev - 1); // Reduce temp errors if correcting a mistake
            }
            setTypedText((prev) => prev.slice(0, - 1));
            setCurrentLetterIndex((prev) => prev - 1);
          } else if (currentWordIndex > 0 && typedText.endsWith(" ")) {
            setCurrentWordIndex((prev) => prev - 1);
            setTypedText((prev) => prev.trim().slice(0));
            const prevWord: string = words[currentWordIndex - 1];
            setCurrentLetterIndex(prevWord.length);
            setCurrentWordErrors(0);

            // Recalculate completed words
            const completed = typedWordsArray
              .slice(0, currentWordIndex)
              .filter((typedWord, i) => typedWord === words[i]).length;
            setCompletedWords(completed);
          }
        }
      } else if (
        e.key.length === 1 &&
        currentLetterIndex < currentWord.length
      ) {
        const expectedLetter: string = currentWord[currentLetterIndex];
        if (e.key !== expectedLetter) {
          setCurrentWordErrors((prev) => prev + 1);
        }
        setTypedText((prev) => prev + e.key);
        setCurrentLetterIndex((prev) => prev + 1);
      }
    },
    [
      isCompleted,
      currentWordIndex,
      currentLetterIndex,
      startTime,
      words,
      mode,
      isTabPressed,
      typedText,
      totalWords,
    ]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    // Reset Tab state when released
    if (e.key === "Tab") {
      setIsTabPressed(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

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

  useEffect(() => {
    if (isCompleted && startTime) {
      const wpm = calculateWPM();
      setFinalWPM(wpm);
    }
  }, [isCompleted, startTime]);

  const resetTest = (regenerateText: boolean = false): void => {
    setTypedText("");
    setCurrentWordIndex(0);
    setCurrentLetterIndex(0);
    setStartTime(null);
    setCurrentWordErrors(0);
    setErrors(0);
    setCompletedWords(0);
    setIsCompleted(false);
    wordRefs.current = Array(words.length).fill(null);
    setFinalWPM(0);
    if (regenerateText && onResetText) {
      onResetText();
    }
    if (isMobile && inputRef.current) {
      inputRef.current.focus(); // Re-focus input after reset on mobile
    }
    console.log("reset test");
  };

  const typedWords: string[] = typedText
    .split(" ")
    .filter((word) => word.length > 0);

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      {isMobile && (
        <input
          ref={inputRef}
          type="text"
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
          onKeyDown={(e) => {
            // Prevent input from capturing events; let document handle them
            e.stopPropagation();
          }}
        />
      )}
      {mode === "time" ? (
        <Timer
          mode={mode}
          startTime={startTime}
          duration={duration}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
        />
      ) : mode === "words" || mode === "quote" ? (
        <WordProgress
          completedWords={completedWords}
          totalWords={totalWords}
          startTime={startTime}
        />
      ) : null}
      {!isCompleted ? (
        words.length > 0 ? (
          <>
            <TextContainer
              words={words}
              typedWords={typedWords}
              currentWordIndex={currentWordIndex}
              currentLetterIndex={currentLetterIndex}
              isCompleted={isCompleted}
              isBlurred={isBlurred}
              textContainerRef={textContainerRef}
              wordRefs={wordRefs}
              renderWord={renderWord}
            />
            <button
              className={styles.resetButton}
              onClick={() => resetTest(true)}
            >
              <RiResetRightLine />
            </button>
          </>
        ) : (
          <div>No text to type. Please select a mode.</div>
        )
      ) : (
        <Results
          wpm={finalWPM}
          errors={errors}
          typedText={typedText}
          onReset={() => resetTest(true)}
        />
      )}
    </div>
  );
}

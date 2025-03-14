"use client";
import Header from "@/components/header";
import Typing from "@/components/Typing";
import "./page.css";
import { CiAt } from "react-icons/ci";
import { FaHashtag } from "react-icons/fa";
import { BsTools } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";
import { TbLetterA } from "react-icons/tb";
import { FaQuoteLeft } from "react-icons/fa6";
import { IoTriangle } from "react-icons/io5";
import { FaWrench } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import {
  FaDonate,
  FaCode,
  FaDiscord,
  FaTwitter,
  FaPalette,
  FaRegFilePdf,
  FaLock,
} from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { IoIosGitBranch } from "react-icons/io";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/Modal";
import { generateRandomWords } from "@/utils/generateRandomWords";
import {
  shortQuotes,
  mediumQuotes,
  longQuotes,
  thiccQuotes,
  allQuotes,
} from "@/utils/quotes";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<
    "time" | "words" | "quote" | "zen" | "custom"
  >("time");
  const [duration, setDuration] = useState<number>(15);
  const [wordcount, setWordCount] = useState<number>(25);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [quoteLength, setQuoteLength] = useState<
  "all" | "short" | "medium" | "long" | "thicc"
  >("all");
  const [text, setText] = useState<string>("");

  const modeBarRef = useRef<HTMLDivElement>(null);
  const footerLinkRef = useRef<HTMLDivElement>(null);

  const handleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const closeModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      setCurrentTheme(theme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      setCurrentTheme("light");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.querySelector(".modal");
      if (modal && !modal.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    let generatedText: string = "";

    if (mode === "time" || mode === "words") {
      const count = mode === "time" ? 500 : wordcount;
      generatedText = generateRandomWords(
        count,
        includeNumbers,
        includePunctuation
      );
    } else if (mode === "quote") {
      let quotePool: { text: string; author: string }[] = [];

      switch (quoteLength) {
        case "short":
          quotePool = shortQuotes;
          break;
        case "medium":
          quotePool = mediumQuotes;
          break;
        case "long":
          quotePool = longQuotes;
          break;
        case "thicc":
          quotePool = thiccQuotes;
          break;
        case "all":
        default:
          quotePool = allQuotes;
          break;
      }

      const selectedQuote = quotePool[
        Math.floor(Math.random() * quotePool.length)
      ] || { text: "No quotes available.", author: "" };

      // Select a random quote from the filtered list
      generatedText = `${selectedQuote.text} - ${selectedQuote.author}`;
    } else if (mode === "zen") {
      generatedText = "- don't have plan to work on this";
    } else if (mode === "custom") {
      generatedText =
        "- you could type your custom text here if I had implemented it lol";
    }
    console.log("Generated Text:", generatedText);
    setText(generatedText);
  }, [mode, wordcount, includeNumbers, includePunctuation, quoteLength]);

  const typingProps = useMemo(
    () => ({
      text,
      mode,
      duration,
      modeBarRef,
      footerLinkRef,
      onTestActiveChange: setIsTestActive,
    }),
    [text, mode, duration]
  );

  return (
    <div className="page">
      <Header isTestActive={isTestActive} />
      <main>
        <div
          className={`type-mode-bar ${isTestActive ? "hidden" : "visible"}`}
          ref={modeBarRef}
        >
          <div>
            <button
              className={includePunctuation ? "active" : ""}
              onClick={() => setIncludePunctuation(!includePunctuation)}
            >
              <CiAt /> punctuation
            </button>
            <button
              className={includeNumbers ? "active" : ""}
              onClick={() => setIncludeNumbers(!includeNumbers)}
            >
              <FaHashtag /> numbers
            </button>
          </div>
          <span id="spacer"></span>
          <div>
            <button
              className={mode === "time" ? "active" : ""}
              onClick={() => setMode("time")}
            >
              <IoMdTime /> time
            </button>
            <button
              className={mode === "words" ? "active" : ""}
              onClick={() => setMode("words")}
            >
              <TbLetterA /> words
            </button>
            <button
              className={mode === "quote" ? "active" : ""}
              onClick={() => setMode("quote")}
            >
              <FaQuoteLeft /> quote
            </button>
            <button
              className={mode === "zen" ? "active" : ""}
              onClick={() => setMode("zen")}
            >
              <IoTriangle /> zen
            </button>
            <button
              className={mode === "custom" ? "active" : ""}
              onClick={() => setMode("custom")}
            >
              <FaWrench /> custom
            </button>
          </div>
          <span id="spacer"></span>
          <div>
            {mode === "time" ? (
              <>
                <button
                  className={duration === 15 ? "active" : ""}
                  onClick={() => setDuration(15)}
                >
                  15
                </button>
                <button
                  className={duration === 30 ? "active" : ""}
                  onClick={() => setDuration(30)}
                >
                  30
                </button>
                <button
                  className={duration === 60 ? "active" : ""}
                  onClick={() => setDuration(60)}
                >
                  60
                </button>
                <button
                  className={duration === 120 ? "active" : ""}
                  onClick={() => setDuration(120)}
                >
                  120
                </button>
              </>
            ) : mode === "words" ? (
              <>
                <button
                  className={wordcount === 15 ? "active" : ""}
                  onClick={() => setWordCount(15)}
                >
                  10
                </button>
                <button
                  className={wordcount === 25 ? "active" : ""}
                  onClick={() => setWordCount(25)}
                >
                  25
                </button>
                <button
                  className={wordcount === 50 ? "active" : ""}
                  onClick={() => setWordCount(50)}
                >
                  50
                </button>
                <button
                  className={wordcount === 100 ? "active" : ""}
                  onClick={() => setWordCount(100)}
                >
                  100
                </button>
              </>
            ) : mode === "quote" ? (
              <>
                <button
                  className={quoteLength === "all" ? "" : ""}
                  onClick={() => setQuoteLength("all")}
                >
                  all
                </button>
                <button
                  className={
                    quoteLength === "short" || quoteLength === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() => setQuoteLength("short")}
                >
                  short
                </button>
                <button
                  className={
                    quoteLength === "medium" || quoteLength === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() => setQuoteLength("medium")}
                >
                  medium
                </button>
                <button
                  className={
                    quoteLength === "long" || quoteLength === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() => setQuoteLength("long")}
                >
                  long
                </button>
                <button
                  className={
                    quoteLength === "thicc" || quoteLength === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() => setQuoteLength("thicc")}
                >
                  thicc
                </button>
              </>
            ) : (
              <button>
                <BsTools />
              </button>
            )}
          </div>
        </div>
        <Typing {...typingProps} />
      </main>
      <footer>
        <div className={`footer ${isTestActive ? "hidden" : "visible"}`}>
          <div>
            <div className="row">
              <div>tab</div> + <div>enter</div> - restart test
            </div>
            <div className="row">
              <div>esc</div> or <div>ctrl</div> + <div>shift</div> +{" "}
              <div>p</div> - command line
            </div>
          </div>
          <div className="links" ref={footerLinkRef}>
            <div>
              <button>
                <MdOutlineEmail /> contact
              </button>
              <button>
                <FaDonate /> support
              </button>
              <Link href={"https://github.com/RaiPeter"}>
                <FaCode /> github
              </Link>
              <Link href={""}>
                <FaDiscord /> discord
              </Link>
              <Link href={"https://x.com/RaiPeter2"}>
                <FaTwitter /> twitter
              </Link>
              <Link href={""}>
                <FaRegFilePdf /> terms
              </Link>
              <Link href={""}>
                <MdOutlineSecurity /> security
              </Link>
              <Link href={""}>
                <FaLock /> privacy
              </Link>
            </div>
            <div>
              <button onClick={() => handleModal()}>
                <FaPalette /> {currentTheme}
              </button>
              <button>
                <IoIosGitBranch /> v2.23.4
              </button>
            </div>
          </div>
        </div>
      </footer>
      {isModalOpen && <Modal setCurrentTheme={setCurrentTheme} />}
    </div>
  );
};

export default Page;

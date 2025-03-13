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
import { FaDonate, FaCode, FaDiscord, FaTwitter,FaPalette , FaRegFilePdf, FaLock } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { IoIosGitBranch } from "react-icons/io";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";
import { generateRandomWords } from "@/utils/generateRandomWords";

const quotes = [
  "To be or not to be that is the question.",
  "Life is what happens when you're busy making other plans.",
  "The only way to do great work is to love what you do.",
];

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"time" | "words" | "quote" | "zen" | "custom">("time");
  const [duration, setDuration] = useState<number>(15);
  const [wordcount, setWordCount] = useState<number>(25);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [currentTheme, setCurrentTheme] = useState<string>("");

  const modeBarRef = useRef<HTMLDivElement>(null);
  const footerLinkRef = useRef<HTMLDivElement>(null);

  const handleModal = () => {
    setIsModalOpen((prev)=> !prev);
  }

  const closeModal = () => {
    setIsModalOpen((prev)=>!prev);
  };
  
  useEffect(()=>{
    const theme= localStorage.getItem("theme");
    if(theme) {
      document.documentElement.setAttribute("data-theme",theme);
      setCurrentTheme(theme);
    }
  },[currentTheme])

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

  useEffect(()=>{
    let generatedText: string = "";
    if(mode === "time" || mode === "words"){
      const count = mode === "time" ? 100 : wordcount;
      generatedText = generateRandomWords(count, includeNumbers, includePunctuation);
    }else if(mode === "quote"){
      generatedText = quotes[Math.floor(Math.random() * quotes.length)]
    }else if(mode === "zen"){
      generatedText = "";
    }else if(mode === "custom"){
      generatedText = "type your custom text here";
    }
    console.log("Generated Text:", generatedText);
    setText(generatedText);
  },[mode,wordcount,includeNumbers,includePunctuation]);

  return (
    <div className="page">
      <Header />
      <main>
        <div className="type-mode-bar" ref={modeBarRef}>
          <div>
            <button onClick={() => setIncludePunctuation(!includePunctuation)}>
              <CiAt /> punctuation
            </button>
            <button onClick={() => setIncludePunctuation(!includeNumbers)}>
              <FaHashtag /> numbers
            </button>
          </div>
          <span id="spacer"></span>
          <div>
            <button onClick={() => setMode("time")}>
              <IoMdTime /> time
            </button>
            <button onClick={() => setMode("words")}>
              <TbLetterA /> words
            </button>
            <button onClick={() => setMode("quote")}>
              <FaQuoteLeft /> quote
            </button>
            <button onClick={() => setMode("zen")}>
              <IoTriangle /> zen
            </button>
            <button onClick={() => setMode("custom")}>
              <FaWrench /> custom
            </button>
          </div>
          <span id="spacer"></span>
          <div>
            {mode === "time" ? (
              <>
              <button onClick={() => setDuration(15)}>15</button>
              <button onClick={() => setDuration(30)}>30</button>
              <button onClick={() => setDuration(60)}>60</button>
              <button onClick={() => setDuration(120)}>120</button>
              </>
            ) : mode === "words" ? (
              <>
              <button onClick={() => setWordCount(15)}>10</button>
              <button onClick={() => setWordCount(25)}>25</button>
              <button onClick={() => setWordCount(50)}>50</button>
              <button onClick={() => setWordCount(100)}>100</button>
              </>
            ) : null
            }
            <button>
              <BsTools />
            </button>
          </div>
        </div>
        <Typing text={text} mode={mode} duration={duration} modeBarRef={modeBarRef} footerLinkRef={footerLinkRef}/>
      </main>
      <footer>
        <div className="footer">
          <div>
            <div className="row">
              <div>tab</div> + <div>enter</div> - restart test
            </div>
            <div className="row">
              <div>esc</div> or <div>ctrl</div> + <div>shift</div> + <div>p</div> - command line
            </div>
          </div>
          <div className="links" ref={footerLinkRef}>
            <div>
              <button><MdOutlineEmail /> contact</button>
              <button><FaDonate /> support</button>
              <Link href={""}><FaCode /> github</Link>
              <Link href={""}><FaDiscord /> discord</Link>
              <Link href={""}><FaTwitter /> twitter</Link>
              <Link href={""}><FaRegFilePdf  /> terms</Link>
              <Link href={""}><MdOutlineSecurity /> security</Link>
              <Link href={""}><FaLock /> privacy</Link>
            </div>
            <div>
              <button onClick={() => handleModal()}><FaPalette /> {currentTheme}</button>
              <button><IoIosGitBranch /> v2.23.4</button>
            </div>
          </div>
        </div>
      </footer>
    {isModalOpen && <Modal setCurrentTheme={setCurrentTheme}/>}
    </div>
  );
};

export default Page;

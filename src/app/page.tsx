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
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";

const Page = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleModel = () => {
    setIsModelOpen((prev)=> !prev);
  }

  const closeModal = () => {
    setIsModelOpen((prev)=>!prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.querySelector(".modal");
      if (modal && !modal.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModelOpen]);

  return (
    <div className="page">
      <Header />
      <main>
        <div className="type-mode-bar">
          <div>
            <button>
              <CiAt /> punctuation
            </button>
            <button>
              <FaHashtag /> numbers
            </button>
          </div>
          <span id="spacer"></span>
          <div>
            <button>
              <IoMdTime /> time
            </button>
            <button>
              <TbLetterA /> words
            </button>
            <button>
              <FaQuoteLeft /> quote
            </button>
            <button>
              <IoTriangle /> zen
            </button>
            <button>
              <FaWrench /> custom
            </button>
          </div>
          <span id="spacer"></span>
          <div>
            <button>15</button>
            <button>30</button>
            <button>60</button>
            <button>120</button>
            <button>
              <BsTools />
            </button>
          </div>
        </div>
        <Typing />
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
          <div className="links">
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
              <button onClick={() => handleModel()}><FaPalette /> rose pine</button>
              <button><IoIosGitBranch /> v2.23.4</button>
            </div>
          </div>
        </div>
      </footer>
    {isModelOpen && <Modal />}
    </div>
  );
};

export default Page;

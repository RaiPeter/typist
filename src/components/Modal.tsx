import React, { useState } from "react";
import "./Modal.css";
import { TiTick } from "react-icons/ti";

interface Prop {
  setCurrentTheme: (theme: string) => void;
}

const themes = [
  { name: "dark" },
  { name: "ocean" },
  { name: "forest" },
  { name: "sunset" },
  { name: "monochrome" },
  { name: "pastel" },
  { name: "serika dark" },
];
const Modal = ({ setCurrentTheme }: Prop) => {
  const [modalTheme, setModalTheme] = useState(localStorage.getItem("theme") || "");
  const handleTheme = (e: React.MouseEvent<HTMLLabelElement>) => {
    const label = (e.target as HTMLLabelElement).innerText;
    setModalTheme(label);
    document.documentElement.setAttribute("data-theme", label);
    localStorage.setItem("theme", label);
    setCurrentTheme(label);
  };

  const handleHover = (themeName: string) => {
    document.documentElement.setAttribute("data-theme", themeName);
  };

  const handleHoverEnd = () => {
    document.documentElement.setAttribute("data-theme", modalTheme);
  };

  return (
    <div className="modal">
      <div className="themes">
        {themes.map((theme) => (
          <label
            key={theme.name}
            onClick={(e) => handleTheme(e)}
            onMouseEnter={() => handleHover(theme.name)}
            onMouseLeave={handleHoverEnd}
          >
            <div className="current">
              <TiTick style={{visibility : modalTheme === theme.name ? "visible" : "hidden"}}/>
              <div className="name">{theme.name}</div>
            </div>
            <div className="preview" data-theme={theme.name}>
              <div className="bg-box">
                <div className="text"></div>
                <div className="accent"></div>
                <div className="row-bg"></div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Modal;

import React, { useState } from "react";
import "./Modal.css";

const Modal = () => {
    const [theme, setTheme] = useState("");
    const handleTheme = (e: React.MouseEvent<HTMLLabelElement>) => {
        const label = (e.target as HTMLLabelElement).innerText;
        setTheme(label);
        console.log(label);
        document.documentElement.setAttribute(
            "data-theme",
            label
        );
        localStorage.setItem("theme", label);
    }
    
  return (
    <div className="modal">
      <div className="themes">
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>dark</label>
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>ocean</label>
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>forest</label>
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>sunset</label>
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>monochrome</label>
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>pastel</label>
        <label htmlFor="" onClick={(e)=> handleTheme(e)}>serika dark</label>
      </div>
    </div>
  );
};

export default Modal;

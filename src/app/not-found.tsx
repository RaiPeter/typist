"use client";
import Link from "next/link";
import { useEffect } from "react";
import { FaKeyboard, FaArrowLeft } from "react-icons/fa";
import "./404.css"; // Adjust path as needed

const NotFoundPage = () => {
  // Ensure the theme is applied on the 404 page
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  return (
    <div className="not-found-page">
      <div className="content">
        <h1 className="error-code">404</h1>
        <h2 className="message">Oops! Page Not Found</h2>
        <p className="description">
          Looks like you typed in the wrong URL. Don’t worry, let’s get you back
          to typing practice!
        </p>
        <div className="icon">
          <FaKeyboard size={100} />
        </div>
        <Link href="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
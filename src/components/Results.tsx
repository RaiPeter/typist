import React from "react";
import { RiResetRightLine } from "react-icons/ri";
import "./Results.css";

interface ResultProps {
  wpm: number;
  errors: number;
  typedText: string;
  onReset: () => void;
}

const Results = ({ wpm, errors, typedText, onReset }: ResultProps) => {
  return (
    <div className="results">
      <div>
        <h2>Test Completed!</h2>
      </div>
      <div>
        <div>
          <label>wpm</label>
          <p>{wpm}</p>
        </div>
        <div>
          <label>accuracy</label>
          <p>
            {typedText.length > 0
              ? Math.round(
                  ((typedText.length - errors) / typedText.length) * 100
                )
              : 0}
            %
          </p>
        </div>
        <div>
          <label>errors</label>
          <p>{errors}</p>
        </div>
      </div>
      <div>
      <button className="resetButton" autoFocus onClick={onReset}>
        <RiResetRightLine />
      </button>
      </div>
    </div>
  );
};

export default Results;

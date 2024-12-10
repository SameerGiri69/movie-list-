import React from "react";
import { ClipLoader } from "react-spinners";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div id="loading-spinner">
      <ClipLoader
        color="#999966"
        size={35}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;

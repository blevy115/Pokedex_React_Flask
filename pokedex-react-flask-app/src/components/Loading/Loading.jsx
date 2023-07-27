import React from "react";
import { FaSpinner } from "react-icons/fa";

import "./Loading.scss";

const Loading = ({ fullscreen = true }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: fullscreen ? "100vh" : "300px",
      }}
    >
      <FaSpinner size={40} className="spin" />
    </div>
  );
};

export default Loading;

import React from "react";
import { FaSpinner } from "react-icons/fa";

import "./Loading.scss";

const Loading = ({ fullscreen = true, overlay = false }) => {
  return (
    <div
      className={`app__loading-spinner ${fullscreen ? "fullscreen" : null} ${
        overlay ? "overlay" : null
      }`}
    >
      <FaSpinner size={40} className="spin" />
    </div>
  );
};

export default Loading;

import React from "react";
import { FaSpinner } from "react-icons/fa";

import "./Loading.scss";

const Loading = ({ fullscreen = true }) => {
  return (
    <div className={`app__loading-spinner ${fullscreen ? "fullscreen" : null}`}>
      <FaSpinner size={40} className="spin" />
    </div>
  );
};

export default Loading;

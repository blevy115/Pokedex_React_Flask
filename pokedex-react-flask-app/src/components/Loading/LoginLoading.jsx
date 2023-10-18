import React, { useState, useEffect } from "react";

import "./LoginLoading.scss";

const loadingMessages = [
  "Catching 'em all...",
  "Searching for Pokémon...",
  "Training Pikachu...",
  "Exploring tall grass...",
  "Battling wild Pokémon...",
  "Evolution in progress...",
  "Healing Pokémon...",
  "Visiting the Poké Mart...",
  "Hatching eggs...",
  "Flying on a Charizard...",
  "Surfing with Lapras...",
];

const LoginLoading = () => {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage =
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
      setCurrentMessage(randomMessage);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app__loading-spinner fullscreen overlay">
      <img
        className="spin"
        src="/icons/loading/pokeball.png"
        alt="pokeball icon"
        width="50" height="50"
      />
      <div className="loading-message">{currentMessage}</div>
    </div>
  );
};

export default LoginLoading;

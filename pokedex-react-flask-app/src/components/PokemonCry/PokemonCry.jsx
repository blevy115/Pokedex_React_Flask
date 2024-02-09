import React, { useState, useRef, useEffect } from "react";

import { FiMusic } from "react-icons/fi";

import { getCry } from "../../helpers/getCry";

import "./PokemonCry.scss";

const PokemonCry = ({ id }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    setIsPlaying(false)
  }, [id])

  const audioRef = useRef(null);
  const audioFile = getCry(id);

  const togglePlay = () => {
    if (isPlaying) return;

    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="pokemon-cry-container">
      <button onClick={togglePlay}>
        Cry{isPlaying && <FiMusic className="music-note" />}
      </button>
      <audio key={id} ref={audioRef} onEnded={() => setIsPlaying(false)}>
        <source src={audioFile} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default PokemonCry;

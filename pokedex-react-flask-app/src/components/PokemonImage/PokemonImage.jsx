import React, { useEffect, useState } from "react";

import { getImage, getShinyImage } from "../../helpers/pictures";

import "./PokemonImage.scss";

const PokemonImage = ({ id }) => {
  const [artworkIsShiny, setArtworkIsShiny] = useState(false);
  useEffect(() => {
    setArtworkIsShiny(false)
  }, [id])

  return (
    <>
      <div className="app__pokemon-image-container">
        <button
          className={`shiny-button ${artworkIsShiny ? "active" : ""}`}
          onClick={() => setArtworkIsShiny(!artworkIsShiny)}
        >
          <img
            className="shiny-button-image"
            src={`/icons/symbols/shiny.png`}
          />
        </button>
        <img
          className="pokemon-image"
          src={artworkIsShiny ? getShinyImage(id) : getImage(id)}
          alt={`${artworkIsShiny ? "shiny-" : ""}official-artwork`}
        />
      </div>
    </>
  );
};

export default PokemonImage;

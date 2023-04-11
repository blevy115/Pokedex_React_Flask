import React, { useState, useEffect } from "react";
import { getImage, getShinyImage } from "../helpers/pictures";

export default function PokemonImages({ id }) {
  const [artworkIsShiny, setArtworkIsShiny] = useState();
  useEffect(() => {
    setArtworkIsShiny(false);
  }, [id]);

  return (
    <>
      <div id="pokemon-image-container">
        <button
          id={`shiny-button${artworkIsShiny ? "-active" : ""}`}
          onClick={() => setArtworkIsShiny(!artworkIsShiny)}
        >
          <img src={`/icons/symbols/shiny.png`} />
        </button>

        <p>{artworkIsShiny ? "Shiny" : "Regular"}</p>
        <img
          className="PokemonImage"
          src={artworkIsShiny ? getShinyImage(id) : getImage(id)}
          alt={`${artworkIsShiny ? "shiny-" : ""}official-artwork`}
        />
      </div>
    </>
  );
}

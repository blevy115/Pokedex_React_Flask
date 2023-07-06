import React, { useState } from "react";
import { getImage, getShinyImage } from "../helpers/pictures";

export default function PokemonImages({ id }) {
  const [artworkIsShiny, setArtworkIsShiny] = useState(false);

  return (
    <>
      <div id="pokemon-image-container">
        <button
          id={`shiny-button${artworkIsShiny ? "-active" : ""}`}
          onClick={() => setArtworkIsShiny(!artworkIsShiny)}
        >
          <img style={{height: "30px"}} src={`/icons/symbols/shiny.png`} />
        </button>

        <img
          className="pokemon-image"
          src={artworkIsShiny ? getShinyImage(id) : getImage(id)}
          alt={`${artworkIsShiny ? "shiny-" : ""}official-artwork`}
        />
      </div>
    </>
  );
}

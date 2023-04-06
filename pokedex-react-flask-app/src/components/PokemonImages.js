import React, { useState, useRef } from "react";
import { getImage, getShinyImage } from "../helpers/pictures";

export default function PokemonImages({ id }) {
  const [loading, setLoading] = useState(true);
  const imageCounter = useRef(0);
  const imageLoaded = () => {
    imageCounter.current += 1;
    if (imageCounter.current == 2) {
      // Number of Images
      setLoading(false);
    }
  };
  return (
    <>
      <div style={{ display: loading ? "block" : "none", textAlign: "center" }}>
        Loading images...
      </div>
      <div
        style={{
          display: loading ? "none" : "flex",
          justifyContent: "center",
          alignItems: "space-between",
        }}
      >
        <div>
          <p style={{ textAlign: "center" }}>Regular</p>
          <img
            className="PokemonImage"
            src={getImage(id)}
            onLoad={imageLoaded}
          />
        </div>
        <div>
          <p style={{ textAlign: "center" }}>Shiny</p>
          <img
            className="PokemonImage"
            src={getShinyImage(id)}
            onLoad={imageLoaded}
          />
        </div>
      </div>
    </>
  );
}

import React, { useState } from "react";

const GenerationSelector = ({ generation, pokedexes }) => {
  const [selectedDex, setSelectedDex] = useState(
    pokedexes[0].pokemon_v2_pokedex.name
  );

  return (
    <div id="regional-pokedex-selector">
      <p>Generation: {generation}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
        <p>Pokedex: </p>
        <select
          value={selectedDex}
          onChange={(e) => setSelectedDex(e.target.value)}
          style={{ margin: "0 1rem" }}
        >
          {pokedexes.map((pokedex, i) => (
            <option key={i} value={pokedex.pokemon_v2_pokedex.name}>
              {pokedex.pokemon_v2_pokedex.name}
            </option>
          ))}
        </select>
        <p>
          #
          {
            pokedexes.find(
              (pokedex) => pokedex.pokemon_v2_pokedex.name === selectedDex
            ).pokedex_number
          }
        </p>
      </div>
    </div>
  );
};

export default GenerationSelector;

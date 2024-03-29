import React, { useState } from "react";

import { formatName } from "../../helpers/format";

import "./GenerationSelector.scss";

const GenerationSelector = ({ pokedexes }) => {
  const [selectedDex, setSelectedDex] = useState(
    pokedexes[0].pokemon_v2_pokedex.name
  );

  return (
    <div className="app__regional-pokedex-selector">
      <div className="regional-pokedex-selector-container">
        <p>Pokedex: </p>
        <select
          value={selectedDex}
          onChange={(e) => setSelectedDex(e.target.value)}
        >
          {pokedexes.map((pokedex, i) => (
            <option key={i} value={pokedex.pokemon_v2_pokedex.name}>
              {formatName(pokedex.pokemon_v2_pokedex.name)}
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

import React, { useState, useEffect } from "react";

import { formatName } from "../../helpers/format";

import { LocationPokemonsTable } from "../";

const LocationEncounters = ({ encounters }) => {
  const generationOptions = Object.keys(encounters);

  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, []);

  if (!generation) return null;

  return (
    <div style={{ width: "80%", margin: " 0 auto" }}>
      <select
        id="LocationEncounterGenerationSelector"
        value={generation}
        onChange={(e) => setGeneration(parseInt(e.target.value))}
      >
        {generationOptions.map((gen, i) => {
          return (
            <option key={i} value={gen}>
              {gen}
            </option>
          );
        })}
      </select>
      {encounters[generation]
        ? Object.entries(encounters[generation]).map(
            ([location, pokemonEncounters]) => (
              <div key={location}>
                <h3>{formatName(location)}</h3>
                <LocationPokemonsTable
                  pokemonEncounters={pokemonEncounters.sort((a, b) =>
                    a.game.localeCompare(b.game)
                  )}
                />
              </div>
            )
          )
        : null}
      {/* {Table component} */}
    </div>
  );
};

export default LocationEncounters;

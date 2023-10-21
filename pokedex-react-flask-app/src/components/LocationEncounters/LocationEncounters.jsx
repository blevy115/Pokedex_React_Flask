import React, { useState, useEffect } from "react";

import { formatName } from "../../helpers/format";

import { LocationPokemonsTable } from "../";

import "./LocationEncounters.scss";

const LocationEncounters = ({ encounters }) => {
  const [generation, setGeneration] = useState();
  const generationOptions = Object.keys(encounters);

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, []);

  if (!generation) return null;

  return (
    <div className="app__location-pokemons">
      <h2 className="text-center">Encounters</h2>
      <div className="select-input">
        <label htmlFor="LocationEncounterGenerationSelector">Generation:</label>
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
      </div>
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
    </div>
  );
};

export default LocationEncounters;

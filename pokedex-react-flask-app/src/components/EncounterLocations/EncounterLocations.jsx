import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { mergePokemonEncounters } from "../../helpers/mergeEncounters";
import { formatGameName, formatName } from "../../helpers/format";

const EncounterLocations = ({ encounters }) => {
  const navigate = useNavigate();
  console.log(navigate);
  const encountersByGeneration = useMemo(
    () => mergePokemonEncounters(encounters),
    [encounters]
  );
  const generationOptions = useMemo(
    () => Object.keys(encountersByGeneration),
    [encountersByGeneration]
  );
  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, [generationOptions]);

  if (
    !encountersByGeneration ||
    !generation ||
    !encountersByGeneration[generation]
  )
    return null;

  console.log(Object.entries(encountersByGeneration[generation]));

  return (
    <div className="app__pokemon-encounters">
      <h4>Locations</h4>
      <div className="select-input">
        <label htmlFor="EncounterGenerationSelector">Generation:</label>
        <select
          id="EncounterGenerationSelector"
          value={generation}
          onChange={(e) => setGeneration(parseInt(e.target.value))}
        >
          {generationOptions.map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      {Object.entries(encountersByGeneration[generation]).map(
        ([game, locations]) => (
          <div key={game}>
            <p>{formatGameName(game)}</p>
            <ul className="pokemon-encounters-list">
              {locations.map((location, id) => (
                <li
                  className="pokemon-encounters-list-item"
                  key={`${game}-${id}`}
                  onClick={() => navigate(`/locations/${location.id}`)}
                >
                  {formatName(location.name)}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default EncounterLocations;

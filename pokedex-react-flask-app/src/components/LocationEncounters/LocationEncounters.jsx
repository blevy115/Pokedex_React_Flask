import React, { useState, useEffect } from "react";

import "./LocationEncounters";

const LocationEncounters = ({ encounters }) => {
  const generationOptions = Object.keys(encounters);

  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, []);

  if (!generation) return null;

  console.log(encounters[generation])
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
      {/* {encounters[generation] && <LocationPokemonsTable/>} */}
      {/* {Table component} */}
    </div>
  );
};

export default LocationEncounters;

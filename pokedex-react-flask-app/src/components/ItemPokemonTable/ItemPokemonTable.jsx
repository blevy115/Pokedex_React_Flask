import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ItemPokemonTable = ({list}) => {
  const navigate = useNavigate();
  const generationOptions = useMemo(
    () => Object.keys(list),
    [list]
  );

  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, [generationOptions]);

  if (!generation) return null;

  return (
    <>
    <label htmlFor="HeldItemPokemonGenerationSelector">Generation:</label>
      <select
        id="HeldItemPokemonGenerationSelector"
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
    <ul>
      {list[generation].map((pokemon, i) => (
        <li
          key={i}
          onClick={() => navigate(`/pokemon/${pokemon.pokemon.id}`)}
          style={{ cursor: "pointer" }}
        >
          {pokemon.pokemon.name} {pokemon.rarity}%
        </li>
      ))}
    </ul>
    </>
  );
};

export default ItemPokemonTable;

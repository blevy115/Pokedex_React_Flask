import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MOVE_POKEMONS } from "../api/pokeapi";
import { pokemonAPIClient } from "../api/clients";
import { useNavigate } from "react-router-dom";
import { formatPokemonName } from "../helpers/format";
import { handleImageError } from "../helpers/error";
import { getSprite } from "../helpers/pictures";
import mergePokemonEntries from "../helpers/mergePokemonEntries";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
  tm: 4,
};

const defaultMoveLearnMethod = "level";

export default function PokemonsTable({ id, generation }) {
  let navigate = useNavigate();

  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);

  useEffect(() => {
    setGenerationId(generation);
    setMoveType(defaultMoveLearnMethod);
  }, [id]);

  const { data, loading } = useQuery(GET_MOVE_POKEMONS, {
    variables: { id, generationId, moveLearnMethodId: moveTypes[moveType] },
    client: pokemonAPIClient,
  });

  const generationOptions = useMemo(() => {
    const options = [];
    for (let i = generation; i <= 9; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  }, [generation]);

  if (loading) return <p>Loading...</p>;

  const { pokemons } = data.move[0];
  console.log(data)

  return (
    <>
      <div className="select-input">
        <label htmlFor="MoveGenerationSelector">Generation:</label>
        <select
          id="MoveGenerationSelector"
          value={generationId}
          onChange={(e) => setGenerationId(parseInt(e.target.value))}
        >
          {generationOptions}
        </select>
      </div>
      <div className="select-input">
        <label htmlFor="MoveTypeSelector">Move Type:</label>
        <select
          id="MoveTypeSelector"
          value={moveType}
          onChange={(e) => setMoveType(e.target.value)}
        >
          {Object.keys(moveTypes).map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      {pokemons.length > 0 ? (
        <ul className="pokemon-list">
          {mergePokemonEntries(pokemons).map(
            ({ pokemon_v2_pokemon, values }, i) => (
              <li
                className="pokemon-list-item"
                key={i}
                onClick={() => navigate(`/pokemon/${pokemon_v2_pokemon.id}`)}
              >
                <p>
                  {formatPokemonName(pokemon_v2_pokemon.name)} #
                  {pokemon_v2_pokemon.id}
                </p>
                <img
                  onError={handleImageError}
                  src={getSprite(pokemon_v2_pokemon.id)}
                />
                <div>
                  {values.map((val, i) => (
                    <p key={i}>
                      Game: {val.pokemon_v2_versiongroup.name}{" "}
                      {val.level ? `Level:${val.level}` : undefined}
                    </p>
                  ))}
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>No Pokemons Found</p>
      )}
    </>
  );
}

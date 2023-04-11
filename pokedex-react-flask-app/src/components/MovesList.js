import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_MOVES } from "../api/pokeapi";
import { pokemonAPIClient } from "../api/clients";

const moveTypes = ["level", "egg", "tm"];

export default function MovesList({ id, generation }) {
  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(moveTypes[0]);

  useEffect(() => {
    setGenerationId(generation);
    setMoveType(moveTypes[0]);
  }, [id]);

  const { data, loading } = useQuery(GET_POKEMON_MOVES, {
    variables: { id, generationId },
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

  const { level_moves, egg_moves, tm_moves } = data.pokemon_move_details[0];

  const pokemonExistsInGeneration = level_moves.length > 0;

  const moves = {
    level: level_moves,
    egg: egg_moves,
    tm: tm_moves,
  };

  return (
    <>
      <div>
        <label htmlFor="MoveGenerationSelector">Generation</label>
        <select
          id="MoveGenerationSelector"
          value={generationId}
          onChange={(e) => setGenerationId(parseInt(e.target.value))}
        >
          {generationOptions}
        </select>
      </div>
      <div>
        <label htmlFor="MoveTypeSelector">Move Type</label>
        <select
          id="MoveTypeSelector"
          value={moveType}
          onChange={(e) => setMoveType(e.target.value)}
        >
          {moveTypes.map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      {pokemonExistsInGeneration ? (
        moves[moveType].length > 0 ? (
          <ul>
            {moves[moveType].map((move, i) => {
              const hasFlavourText = move.moveInfo.flavourText.length > 0;
              return (
                <li key={i}>
                  <span className="pokemon-move">
                    {move.level ? `Level ${move.level} ` : undefined}
                    {move.moveInfo.name}
                    <img
                      src={`/icons/types/${move.moveInfo.type.name}.png`}
                      alt={`${move.moveInfo.type.name} icon`}
                    />
                    <img
                      src={`/icons/kinds/${move.moveInfo.kind.name}.png`}
                      alt={`${move.moveInfo.kind.name} icon`}
                    />
                  </span>
                  <span className="HoverToSee">
                    {hasFlavourText
                      ? move.moveInfo.flavourText[0].flavor_text
                      : undefined}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Moves Found</p>
        )
      ) : (
        <p>This Pokémon is unavailable within generation {generationId}</p>
      )}
    </>
  );
}

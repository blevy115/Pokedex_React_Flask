import React, { useState } from "react";

const moveTypes = ["level", "egg", "tm"];

export default function MovesList({ levelMoves, eggMoves, tmMoves }) {
  const moves = {
    level: levelMoves,
    egg: eggMoves,
    tm: tmMoves,
  };
  const [moveType, setMoveType] = useState(moveTypes[0]);
  return (
    <>
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
      <ul>
        {moves[moveType].map((move, i) => {
          return (
            <li key={i}>
              {move.level ? `Level ${move.level} ` : undefined}
              {move.pokemon_v2_move.name}
            </li>
          );
        })}
      </ul>
    </>
  );
}

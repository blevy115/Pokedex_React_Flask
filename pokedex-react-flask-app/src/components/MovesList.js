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
          const hasFlavourText = move.moveInfo.flavourText.length > 0;
          return (
            <li key={i}>
              <span style={{ display: "flex", alignItems: "center" }}>
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
    </>
  );
}

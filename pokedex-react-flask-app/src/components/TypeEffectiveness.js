import React from "react";
import getTypeEffectiveness from "../helpers/getTypeEffectiveness";

function categorizeEffectiveness(relations) {
  const result = {
    weak: [],
    resistant: [],
    immune: [],
  };

  for (const [key, value] of Object.entries(relations)) {
    if (value === 0) {
      result.immune.push({ name: key, multiplier: value });
    } else if (value < 1) {
      result.resistant.push({ name: key, multiplier: value });
    } else if (value > 1) {
      result.weak.push({ name: key, multiplier: value });
    }
  }
  return result;
}

export default function TypeEffectiveness({ types }) {
  const typeEffectiveness = getTypeEffectiveness(types);
  const { weak, resistant, immune } =
    categorizeEffectiveness(typeEffectiveness);
  return (
    <>
      {weak.length > 0 && (
        <>
          <p>Weak to</p>
          <ul>
            {weak.map((type, index) => {
              return (
                <li key={index}>
                  {type.name}: {type.multiplier}x
                </li>
              );
            })}
          </ul>
        </>
      )}
      {resistant.length > 0 && (
        <>
          <p>Resistant to</p>
          <ul>
            {resistant.map((type, index) => {
              return (
                <li key={index}>
                  {type.name}: {type.multiplier}x
                </li>
              );
            })}
          </ul>
        </>
      )}
      {immune.length > 0 && (
        <>
          <p>Immune to</p>
          <ul>
            {immune.map((type, index) => {
              return (
                <li key={index}>
                  {type.name}: {type.multiplier}x
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}

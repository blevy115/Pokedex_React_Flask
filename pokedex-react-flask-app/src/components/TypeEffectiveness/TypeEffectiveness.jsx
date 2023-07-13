import React from "react";

import {getTypeEffectiveness} from "../../helpers/getTypeEffectiveness";

import "./TypeEffectiveness.scss";

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

const TypeEffectiveness = ({ types }) => {
  const typeEffectiveness = getTypeEffectiveness(types);
  const { weak, resistant, immune } =
    categorizeEffectiveness(typeEffectiveness);
  return (
    <div className="app__type-effectiveness">
      <p className="text-center">Type Effectiveness</p>
      <div className="type-effectiveness-lists">
        {weak.length > 0 && (
          <div className="type-effectiveness-list-container">
            <p>Weak to</p>
            <ul className="type-effectiveness-list">
              {weak.map((type, index) => {
                return (
                  <li key={index}>
                    <img
                      src={`/icons/types/${type.name}.png`}
                      alt={`${type.name} icon`}
                    />{" "}
                    x {type.multiplier}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {resistant.length > 0 && (
          <div className="type-effectiveness-list-container">
            <p>Resistant to</p>
            <ul className="type-effectiveness-list">
              {resistant.map((type, index) => {
                return (
                  <li key={index}>
                    <img
                      src={`/icons/types/${type.name}.png`}
                      alt={`${type.name} icon`}
                    />{" "}
                    x {type.multiplier}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {immune.length > 0 && (
          <div className="type-effectiveness-list-container">
            <p>Immune to</p>
            <ul className="type-effectiveness-list">
              {immune.map((type, index) => {
                return (
                  <li key={index}>
                    <img
                      src={`/icons/types/${type.name}.png`}
                      alt={`${type.name} icon`}
                    />{" "}
                    x {type.multiplier}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypeEffectiveness;

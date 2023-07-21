import React from "react";
import { useNavigate } from "react-router-dom";

import { getTypeEffectiveness } from "../../helpers/getTypeEffectiveness";
import { getTypeId } from "../../helpers/getTypeId";

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
  const navigate = useNavigate();
  const typeEffectiveness = getTypeEffectiveness(types);
  const { weak, resistant, immune } =
    categorizeEffectiveness(typeEffectiveness);
  return (
    <div className="app__type-effectiveness">
      <h4 className="text-center">Type Effectiveness</h4>
      <div className="type-effectiveness-lists">
        {weak.length > 0 && (
          <div className="type-effectiveness-list-container">
            <p>Weak to</p>
            <ul className="type-effectiveness-list">
              {weak.map((type, index) => {
                return (
                  <li
                    className="clickable"
                    key={index}
                    onClick={() => navigate(`/types/${getTypeId(type.name)}`)}
                  >
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
                  <li
                    className="clickable"
                    key={index}
                    onClick={() => navigate(`/types/${getTypeId(type.name)}`)}
                  >
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
                  <li
                    className="clickable"
                    key={index}
                    onClick={() => navigate(`/types/${getTypeId(type.name)}`)}
                  >
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

import React from "react";

import "./TypeList.scss";

const TypeList = ({ types }) => {
  return (
    <ul className="type-list">
      {types.map((type) => {
        return (
          <li key={type.pokemon_v2_type.id}>
            <img
              src={`/icons/types/${type.pokemon_v2_type.name}.png`}
              alt={`${type.pokemon_v2_type.name} icon`}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default TypeList;

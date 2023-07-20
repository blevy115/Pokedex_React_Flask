import React from "react";
import { useNavigate } from "react-router-dom";

import "./Types.scss";

const Types = ({ types }) => {
  const navigate = useNavigate();
  return (
    <ul className="type-list">
      {types.map((type) => {
        return (
          <li
            className="clickable"
            onClick={() => navigate(`/types/${type.pokemon_v2_type.id}`)}
            key={type.pokemon_v2_type.id}
          >
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

export default Types;

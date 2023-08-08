import React from "react";
import { useNavigate } from "react-router-dom";

import "./Types.scss";

const Types = ({ types, pageId = null }) => {
  const navigate = useNavigate();
  return (
    <ul className="type-list">
      {types.map((type) => {
        return (
          <li
            className={pageId !== type.pokemon_v2_type.id ? "clickable" : ""}
            onClick={() => {
              if (pageId !== type.pokemon_v2_type.id) {
                navigate(`/types/${type.pokemon_v2_type.id}`);
              }
            }}
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

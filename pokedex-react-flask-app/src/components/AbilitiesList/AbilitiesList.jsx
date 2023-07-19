import React from "react";
import { useNavigate } from "react-router-dom";

import { formatPokemonName } from "../../helpers/format";

import "./AbilitiesList.scss";

const AbilitiesList = ({ list }) => {
  let navigate = useNavigate();

  return (
    <ul className="app__abilities-list">
      {list.map(({ name, id }) => (
        <li
          className="app__abilities-list-item"
          key={id}
          onClick={() => navigate(`/abilities/${id}`)}
        >
          <p>{formatPokemonName(name)}</p>
        </li>
      ))}
    </ul>
  );
};

export default AbilitiesList;

import React from "react";
import { useNavigate } from "react-router-dom";

import { formatPokemonName } from "../../helpers/format";

import "./MovesList.scss";

const MovesList = ({ list }) => {
  let navigate = useNavigate();

  return (
    <ul className="app__moves-list">
      {list.map(({ name, id, type, kind }) => (
        <li
          className="app__moves-list-item"
          key={id}
          onClick={() => navigate(`/moves/${id}`)}
        >
          <img
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
          />
          <p>{formatPokemonName(name)}</p>
          <img
            src={`/icons/kinds/${kind.name}.png`}
            alt={`${kind.name} icon`}
          />
        </li>
      ))}
    </ul>
  );
};

export default MovesList;

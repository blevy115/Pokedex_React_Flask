import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPokemonName } from "../helpers/format";

const MovesList = ({ list }) => {
  let navigate = useNavigate();
  return (
    <ul className="moves-list">
      {list.map(({ name, id }) => (
        <li
          className="moves-list-item"
          key={id}
          onClick={() => navigate(`/moves/${id}`)}
        >
          <p>
            {formatPokemonName(name)} #{id}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default MovesList;

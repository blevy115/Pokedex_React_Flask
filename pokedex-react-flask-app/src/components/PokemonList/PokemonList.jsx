import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { handleImageError } from "../../helpers/error";
import { getSprite } from "../../helpers/pictures";

import { Types } from "../";

import "./PokemonList.scss";

const PokemonList = ({ list }) => {
  let navigate = useNavigate();

  return (
    <ul className="app__pokemon-list">
      {list.map(({ name, id, types }) => (
        <li
          className="app__pokemon-list-item"
          key={id}
          onClick={() => navigate(`/pokemon/${id}`)}
        >
          <p className="pokemon-id"> #{id}</p>

          <img onError={handleImageError} src={getSprite(id)} />
          <p className="pokemon-name">{formatName(name)}</p>
          <Types types={types} />
        </li>
      ))}
    </ul>
  );
};

export default PokemonList;

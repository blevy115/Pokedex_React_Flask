import React from "react";
import { useNavigate } from "react-router-dom";

import { formatPokemonName } from "../../helpers/format";
import { getItemSprite } from "../../helpers/pictures";
import { handleImageError } from "../../helpers/error";


import "./ItemsList.scss";

const ItemsList = ({ list }) => {
  let navigate = useNavigate();

  return (
    <ul className="app__items-list">
      {list.map(({ name, id }) => (
        <li
          className="app__items-list-item"
          key={id}
          onClick={() => navigate(`/items/${id}`)}
        >
          <p>{formatPokemonName(name)}</p>
          <img src={getItemSprite(name)} onError={handleImageError}/>
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;

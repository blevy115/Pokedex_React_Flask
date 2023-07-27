import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { getItemSprite } from "../../helpers/pictures";
import { handleItemError } from "../../helpers/error";

import "./ItemsList.scss";

const ItemsList = ({ list }) => {
  let navigate = useNavigate();

  if (list.length === 0) return <p>No Results Found</p>;

  return (
    <ul className="app__items-list">
      {list.map(({ name, id }) => (
        <li
          className="app__items-list-item"
          key={id}
          onClick={() => navigate(`/items/${id}`)}
        >
          <p>{formatName(name)}</p>
          <img src={getItemSprite(name)} onError={handleItemError} />
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;

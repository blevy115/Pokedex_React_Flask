import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";

import "./AbilitiesList.scss";

const AbilitiesList = ({ list }) => {
  let navigate = useNavigate();

  if (list.length === 0) return <p>No Results Found</p>;

  return (
    <ul className="app__abilities-list">
      {list.map(({ name, id }) => (
        <li
          className="app__abilities-list-item"
          key={id}
          onClick={() => navigate(`/abilities/${id}`)}
        >
          <p>{formatName(name)}</p>
        </li>
      ))}
    </ul>
  );
};

export default AbilitiesList;

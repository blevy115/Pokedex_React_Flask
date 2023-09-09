import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";

import "./LocationsList.scss";

const LocationsList = ({ list }) => {
  let navigate = useNavigate();

  if (list.length === 0) return <p>No Results Found</p>;

  return (
    <ul className="app__locations-list">
      {list.map(({ name, id }) => (
        <li
          className="app__locations-list-item"
          key={id}
          onClick={() => navigate(`/locations/${id}`)}
        >
          <p>{formatName(name)}</p>
        </li>
      ))}
    </ul>
  );
};

export default LocationsList;

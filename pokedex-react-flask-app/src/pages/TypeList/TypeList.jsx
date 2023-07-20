import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_TYPES } from "../../api/queries/backend";
import { backEndClient } from "../../api/clients";

import "./TypeList.scss";

const TypeList = () => {
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_TYPES, {
    client: backEndClient,
  });

  if (loading) return <>Loading..</>;

  return (
    <div className="app__type-list">
      <div className="app__type-list-container">
        {data.types.map((type) => (
          <div
            className="app__type-list-item"
            key={type.typeId}
            onClick={() => navigate(`/types/${type.typeId}`)}
          >
            <img
              src={`/icons/symbols/${type.name}.png`}
              alt={`${type.name} symbol`}
            />
            <p>{type.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeList;

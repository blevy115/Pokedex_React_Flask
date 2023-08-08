import React from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { GET_MAX_MOVES_LIST } from "../../api/queries/pokeapi";
import { pokemonAPIClient } from "../../api/clients";

import { formatName } from "../../helpers/format";

import { Loading, MaxMoveTable } from "../";

import "./MaxMoveDetail.scss";

const MaxMoveDetail = ({ move, isStatus = false }) => {
  const navigate = useNavigate();
  const { id, name, flavor, type } = move;

  const { data, loading } = useQuery(GET_MAX_MOVES_LIST, {
    variables: { typeId: type.id, id },
    client: pokemonAPIClient,
    skip: isStatus,
  });

  return (
    <>
      <div className="app__move-info">
        <h1>{formatName(name)}</h1>
        <p>Description: {flavor[0] && flavor[0].text}</p>
        <p className="move-type">
          <span>Type:</span>
          <img
            className="clickable"
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
            onClick={() => navigate(`/types/${type.id}`)}
          />
        </p>
        <div className="move-kind double">
          <span> Kind:</span>
          {isStatus ? (
            <img src="/icons/kinds/status.png" alt="status icon" />
          ) : (
            <div className="z-move-types-container">
              <img src="/icons/kinds/physical.png" alt="physical icon" />
              <img src="/icons/kinds/special.png" alt="special icon" />
            </div>
          )}
        </div>
        <p>Category: Max Move</p>
      </div>
      <div className="max-moves-table-container">
        {!loading ? (
          !isStatus ? (
            <MaxMoveTable data={data} type={type} />
          ) : null
        ) : (
          <Loading fullscreen={false} />
        )}
      </div>
    </>
  );
};

export default MaxMoveDetail;

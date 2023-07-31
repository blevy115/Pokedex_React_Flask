import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { getZMovePower } from "../../helpers/getZMovePower";

import { MovePokemonsTable } from "../";

const StandardMoveDetail = ({ move }) => {
  const navigate = useNavigate();
  const {
    id,
    name,
    type,
    kind,
    generation_id,
    pp,
    accuracy,
    power,
    flavor,
    tm,
    meta,
  } = move;
  return (
    <>
      <div className="app__move-info">
        <h1>{formatName(name)}</h1>
        <p>Description: {flavor[0] && flavor[0].text}</p>
        <p className="move-kind">
          <span>Type:</span>
          <img
            className="clickable"
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
            onClick={() => navigate(`/types/${type.id}`)}
          />
        </p>
        <p className="move-kind">
          <span> Kind:</span>
          <img
            src={`/icons/kinds/${kind.name}.png`}
            alt={`${kind.name} icon`}
          />
        </p>
        <p>Power: {power}</p>
        {generation_id <= 7 && (
          <p style={{ whiteSpace: "pre-line" }}>
            Z-Move Power:{" "}
            {getZMovePower({
              id,
              categoryId: meta[0].move_meta_category_id,
              power,
            })}
          </p>
        )}
        <p>Accuracy: {accuracy}</p>
        <p>PP: {pp}</p>
        {meta.length > 0 && (
          <p>
            Category: {formatName(meta[0].pokemon_v2_movemetacategory.name)}
          </p>
        )}
      </div>
      <MovePokemonsTable id={id} generation={generation_id} tm={tm} />
    </>
  );
};

export default StandardMoveDetail;

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { getZMovePower, getZMoveByType } from "../../helpers/getZMovePower";

import { MovePokemonsTable } from "../";

const finalZMoveId = 728; // USed ID instead of gen because of moves introduced in "lets go"
const zMoveKinds = [2, 3]; // Physical and Special Moves

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
    gmax,
  } = move;

  const maxMove = useMemo(() => {
    if (gmax.length > 0) {
      return getMaxMoveByType(type);
    }
  }, [gmax]);

  const maxMovePower = useMemo(() => {
    if (gmax.length > 0) {
      return getMaxMovePower(
        {
          id,
          categoryId: meta[0].move_meta_category_id,
          power,
        },
        type
      );
    }
  }, [id, gmax]);

  const zMove =
    id <= finalZMoveId && zMoveKinds.includes(kind.id)
      ? getZMoveByType(type.id)
      : null;

  const ZMovePower =
    id <= finalZMoveId
      ? getZMovePower({
          id,
          categoryId: meta[0].move_meta_category_id,
          power,
        })
      : null;

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
        {id <= finalZMoveId && (
          <p style={{ whiteSpace: "pre-line" }}>
            Z-Move:{" "}
            {zMove ? (
              <span
                className="clickable"
                onClick={() => navigate(`/moves/${zMove.id}`)}
              >
                {formatName(zMove.name)}, Power: {ZMovePower}
              </span>
            ) : (
              <span>
                Z-{formatName(name)}, {ZMovePower}
              </span>
            )}
          </p>
        )}
        {maxMove && (
          <p>
            Max-Move{" "}
            <span
              className="clickable"
              onClick={() => navigate(`/moves/${maxMove.id}`)}
            >
              {formatName(maxMove.name)}, Power: {maxMovePower}
            </span>
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

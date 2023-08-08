import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName, formatZMoveName } from "../../helpers/format";
import { getZMoveData } from "../../helpers/zMoveHelper";

import { StandardZMoveTable, UniqueZMoveTable } from "../";

import "./ZMoveDetail.scss";

const ZMoveDetail = ({ move }) => {
  const navigate = useNavigate();
  const { id, name, type, kind, pp, flavor, power } = move;

  const zMoveData = getZMoveData(id);

  const isStandardZMove = !zMoveData["pokemon"];

  return (
    <>
      <div className="app__move-info">
        <h1>{formatName(formatZMoveName(name))}</h1>
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
        {isStandardZMove ? (
          <div className="move-kind double">
            <span> Kind:</span>
            <div className="z-move-types-container">
              <img src="/icons/kinds/physical.png" alt="physical icon" />
              <img src="/icons/kinds/special.png" alt="special icon" />
            </div>
          </div>
        ) : (
          <>
            <p className="move-kind">
              <span> Kind:</span>
              <img
                src={`/icons/kinds/${kind.name}.png`}
                alt={`${kind.name} icon`}
              />
            </p>
            {power && <p>Power: {power}</p>}
          </>
        )}
        <p>PP: {pp}</p>
        <p> Category: Z-Move</p>
        {isStandardZMove && (
          <p>
            Z-Crystal:{" "}
            <span
              className="clickable"
              onClick={() => navigate(`/items/${zMoveData.item.id}`)}
            >
              {formatName(zMoveData.item.name)}
            </span>
          </p>
        )}
      </div>
      <div className="app__z-move-table-container">
        {isStandardZMove ? (
          <StandardZMoveTable typeId={type.id} />
        ) : (
          <UniqueZMoveTable data={zMoveData} />
        )}
      </div>
    </>
  );
};

export default ZMoveDetail;

import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName, formatZMoveName } from "../../helpers/format";
import { getZMoveData } from "../../helpers/getZMovePower";

const ZMoveDetail = ({ move }) => {
  const navigate = useNavigate();
  const { id, name, type, kind, pp, flavor } = move;

  const zMoveData = getZMoveData(id);
  
  const isStandardZMove = !zMoveData["pokemon"]
  return (
    <>
      <div className="app__move-info">
        <h1>{formatName(formatZMoveName(name))}</h1>
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
        {isStandardZMove ? (
          <p className="move-kind">
            <span> Kind:</span>
            <div className="z-move-types-container">
              <img src="/icons/kinds/physical.png" alt="physical icon" />
              <img src="/icons/kinds/special.png" alt="special icon" />
            </div>
          </p>
        ) : (
          <p className="move-kind">
            <span> Kind:</span>
            <img
              src={`/icons/kinds/${kind.name}.png`}
              alt={`${kind.name} icon`}
            />
          </p>
        )}
        <p>PP: {pp}</p>
        <p>Category: Z-Move</p>
      </div>
      {/* Make COnditional for Unique and Standard Z MOves */}
    </>
  );
};

export default ZMoveDetail;

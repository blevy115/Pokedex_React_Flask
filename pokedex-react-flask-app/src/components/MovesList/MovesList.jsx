import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName, formatZMoveName } from "../../helpers/format";
import { isZMove, getZMoveData } from "../../helpers/getZMovePower";
import { isGmaxMove } from "../../helpers/getMaxMoves";

import "./MovesList.scss";

const MovesList = ({ list }) => {
  let navigate = useNavigate();

  if (list.length === 0) return <p>No Results Found</p>;
  return (
    <ul className="app__moves-list">
      {list.map(({ name, id, type, kind }) => (
        <li
          className="app__moves-list-item"
          key={id}
          onClick={() => navigate(`/moves/${id}`)}
        >
          <img
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
          />
          <p>{formatName(formatZMoveName(name))}</p>
          {(isZMove(id) && !getZMoveData(id)["pokemon"]) || isGmaxMove(id) ? (
            <div className="z-move-types-container">
              <img src="/icons/kinds/physical.png" alt="physical icon" />
              <img src="/icons/kinds/special.png" alt="special icon" />
            </div>
          ) : (
            <img
              src={`/icons/kinds/${kind.name}.png`}
              alt={`${kind.name} icon`}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default MovesList;

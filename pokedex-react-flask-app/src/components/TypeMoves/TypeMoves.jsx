import React from "react";
import { useNavigate } from "react-router-dom";

import { modifyMoves } from "../../helpers/modifyForTable";
import { formatName, formatZMoveName } from "../../helpers/format";
import { isZMove, getZMoveData } from "../../helpers/getZMovePower";

import { Table } from "../";

import "./TypeMoves.scss";

const TypeMoves = ({ list }) => {
  const navigate = useNavigate();

  const NameComponent = ({ value, row }) => {
    return (
      <div
        className="clickable"
        onClick={() => navigate(`/moves/${row.original.moveId}`)}
      >
        <p>{formatName(formatZMoveName(value))}</p>
      </div>
    );
  };

  const TypeImageComponent = ({ value }) => {
    return (
      <img
        className="table-image"
        src={`/icons/types/${value}.png`}
        alt={`${value} icon`}
      />
    );
  };

  const KindImageComponent = ({ value, row }) => {
    return isZMove(row.original.moveId) &&
      !getZMoveData(row.original.moveId)["pokemon"] ? (
      <div className="z-move-types-container">
        <img src="/icons/kinds/physical.png" alt="physical icon" />
        <img src="/icons/kinds/special.png" alt="special icon" />
      </div>
    ) : (
      <img
        className="table-image"
        src={`/icons/kinds/${value}.png`}
        alt={`${value} icon`}
      />
    );
  };

  const { tableData, columns } = modifyMoves({
    moves: list.map((move) => ({ moveInfo: move })),
    KindImageComponent,
    TypeImageComponent,
    NameComponent,
  });

  return <Table data={tableData} columns={columns} />;
};

export default TypeMoves;

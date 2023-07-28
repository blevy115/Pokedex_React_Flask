import React from "react";
import { useNavigate } from "react-router-dom";

import { modifyMoves } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";

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
        <p>{formatName(value)}</p>
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

  const KindImageComponent = ({ value }) => {
    return (
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

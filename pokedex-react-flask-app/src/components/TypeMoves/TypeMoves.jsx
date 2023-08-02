import React from "react";

import { modifyMoves } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  MoveNameComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

import "./TypeMoves.scss";

const TypeMoves = ({ list }) => {
  const { tableData, columns } = modifyMoves({
    moves: list.map((move) => ({ moveInfo: move })),
    KindImageComponent,
    NameComponent: MoveNameComponent,
    hasType: false,
  });

  return <Table data={tableData} columns={columns} />;
};

export default TypeMoves;

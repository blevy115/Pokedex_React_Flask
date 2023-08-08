import React from "react";

import { modifyMovesForMaxMoveTable } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  MoveNameComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

const GMaxMoveTable = ({ data, type, hasMaxPower }) => {
  const { tableData, columns } = modifyMovesForMaxMoveTable({
    moves: data.pokemon_v2_move,
    NameComponent: MoveNameComponent,
    KindImageComponent,
    type,
    isGmax: true,
    hasMaxPower,
  });
  return <Table data={tableData} columns={columns} />;
};

export default GMaxMoveTable;

import React from "react";

import { modifyMovesForMaxMoveTable } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  MoveNameComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

const MaxMoveTable = ({ data, type }) => {
  const { tableData, columns } = modifyMovesForMaxMoveTable({
    moves: data.pokemon_v2_move,
    NameComponent: MoveNameComponent,
    KindImageComponent,
    type,
  });
  return <Table data={tableData} columns={columns} />;
};

export default MaxMoveTable;

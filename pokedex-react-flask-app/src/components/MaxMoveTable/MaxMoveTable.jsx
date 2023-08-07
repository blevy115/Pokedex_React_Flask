import React from "react";

import { modifyMovesForMaxMoveTable } from "../../helpers/modifyForTable";
import {
  MoveNameComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";
import { Table } from "../";

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

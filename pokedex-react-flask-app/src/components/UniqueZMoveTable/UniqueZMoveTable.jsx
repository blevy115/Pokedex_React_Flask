import React from "react";

import { modifyMovesForUniqueZMoveTable } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  SpriteComponent,
  PokemonNameComponent,
  MoveComponent,
  ItemComponent,
} from "../TableCellComponents/TableCellComponents";

const UniqueZMoveTable = ({ data }) => {
  const { tableData, columns } = modifyMovesForUniqueZMoveTable({
    data,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    MoveComponent,
    ItemComponent,
  });
  return (
    <Table
      data={tableData}
      columns={columns}
      hasFilterValue={false}
      hasSortBy={false}
    />
  );
};

export default UniqueZMoveTable;

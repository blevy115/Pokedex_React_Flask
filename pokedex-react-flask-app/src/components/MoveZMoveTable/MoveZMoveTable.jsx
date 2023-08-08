import React from "react";

import { modifyMoveUniqueZMove } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  SpriteComponent,
  PokemonNameComponent,
  MoveComponent,
  KindImageComponent,
  ItemComponent,
} from "../TableCellComponents/TableCellComponents";

const MoveZMoveTable = ({ moves }) => {
  const { tableData, columns } = modifyMoveUniqueZMove({
    moves,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    MoveComponent,
    KindImageComponent,
    ItemComponent,
  });

  return (
    <div className="move-z-move-table">
      <Table data={tableData} columns={columns} />
    </div>
  );
};

export default MoveZMoveTable;

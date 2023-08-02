import React from "react";

import { modifyPokemonUniqueZMove } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  MoveNameComponent,
  MoveComponent,
  TypeImageComponent,
  KindImageComponent,
  ItemComponent,
} from "../TableCellComponents/TableCellComponents";

const PokemonZMoveTable = ({ move }) => {
  const { tableData, columns } = modifyPokemonUniqueZMove({
    move,
    NameComponent: MoveNameComponent,
    MoveComponent,
    TypeImageComponent,
    KindImageComponent,
    ItemComponent,
  });

  return (
    <div>
      <h4 className="text-center">Z-Moves</h4>
      <Table
        data={tableData}
        columns={columns}
        hasFilterValue={false}
        hasSortBy={false}
      />
    </div>
  );
};

export default PokemonZMoveTable;

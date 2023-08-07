import React from "react";

import { modifyPokemonGMAXMove } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  MoveNameComponent,
  TypeImageComponent,
} from "../TableCellComponents/TableCellComponents";

const PokemonGMaxMoveTable = ({ move }) => {
  const { tableData, columns } = modifyPokemonGMAXMove({
    move,
    NameComponent: MoveNameComponent,
    TypeImageComponent,
  });

  return (
    <div>
      <h4 className="text-center">G-Max Move</h4>
      <Table
        data={tableData}
        columns={columns}
        hasFilterValue={false}
        hasSortBy={false}
      />
    </div>
  );
};

export default PokemonGMaxMoveTable;

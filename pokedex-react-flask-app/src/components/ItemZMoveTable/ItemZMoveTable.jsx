import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { modifyItemUniqueZMove } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  SpriteComponent,
  PokemonNameComponent,
  MoveComponent,
  TypeImageComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

import "./ItemZMoveTable.scss";

const ItemZMoveTable = ({ data }) => {
  const navigate = useNavigate();

  if (!data.pokemon) {
    return (
      <p
        className="text-center clickable"
        onClick={() => navigate(`/moves/${data.id}`)}
      >
        Z-Move: {formatName(data.name)}
      </p>
    );
  }

  const { tableData, columns } = modifyItemUniqueZMove({
    data,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    MoveComponent,
    ZMoveComponent: MoveComponent,
    TypeImageComponent,
    KindImageComponent,
  });

  return (
    <div className="item-z-move-table">
      <Table
        hasFilterValue={false}
        hasSortBy={false}
        data={tableData}
        columns={columns}
      />
    </div>
  );
};

export default ItemZMoveTable;

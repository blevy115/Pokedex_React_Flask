import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { getSprite } from "../../helpers/pictures";
import { getTypeId } from "../../helpers/getTypeId";
import { handleSpriteError } from "../../helpers/error";

import { modifyItemUniqueZMove } from "../../helpers/modifyForTable";

import { Table } from "../";

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

  const SpriteComponent = ({ value }) => {
    return (
      <img
        className="pokemon-list-item-sprite clickable"
        onError={handleSpriteError}
        src={getSprite(value)}
        onClick={() => navigate(`/pokemon/${value}`)}
      />
    );
  };

  const NameComponent = ({ value, row }) => {
    return (
      <p
        className="pokemon-list-item-name clickable"
        onClick={() => navigate(`/pokemon/${row.original.spriteId}`)}
      >
        {formatName(value)}
      </p>
    );
  };

  const MoveComponent = ({ value }) => {
    return (
      <p className="clickable" onClick={() => navigate(`/moves/${value.id}`)}>
        {formatName(value.name)}
      </p>
    );
  };

  const ZMoveComponent = ({ value }) => {
    return (
      <p className="clickable" onClick={() => navigate(`/moves/${value.id}`)}>
        {formatName(value.name)}
      </p>
    );
  };

  const TypeImageComponent = ({ value }) => {
    return (
      <img
        className="table-image clickable"
        src={`/icons/types/${value}.png`}
        alt={`${value} icon`}
        onClick={() => navigate(`/types/${getTypeId(value)}`)}
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

  const { tableData, columns } = modifyItemUniqueZMove({
    data,
    SpriteComponent,
    NameComponent,
    MoveComponent,
    ZMoveComponent,
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

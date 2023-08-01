import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { getItemSprite, getSprite } from "../../helpers/pictures";
import { handleItemError, handleSpriteError } from "../../helpers/error";
import { modifyMoveUniqueZMove } from "../../helpers/modifyForTable";

import { Table } from "../";

const MoveZMoveTable = ({ moves }) => {
  const navigate = useNavigate();

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

  const KindImageComponent = ({ value }) => {
    return (
      <img
        className="table-image"
        src={`/icons/kinds/${value}.png`}
        alt={`${value} icon`}
      />
    );
  };

  const ItemComponent = ({ value }) => {
    return (
      <div
        className="clickable"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => navigate(`/items/${value.id}`)}
      >
        <p style={{ marginRight: "0.5rem" }}>{formatName(value.name)}</p>
        <img
          src={getItemSprite(`${value.name}--bag`)}
          onError={handleItemError}
        />
      </div>
    );
  };

  const { tableData, columns } = modifyMoveUniqueZMove({
    moves,
    SpriteComponent,
    NameComponent,
    MoveComponent,
    KindImageComponent,
    ItemComponent,
  });

  return (
    <div>
      <h4 className="text-center">Z-Moves</h4>
      <Table
        data={tableData}
        columns={columns}
      />
    </div>
  );
};

export default MoveZMoveTable;

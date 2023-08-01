import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { modifyMovesForUniqueZMoveTable } from "../../helpers/modifyForTable";
import { handleSpriteError, handleItemError } from "../../helpers/error";
import { getSprite, getItemSprite } from "../../helpers/pictures";

import { Table } from "../";

const UniqueZMoveTable = ({ data }) => {
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
        className="move-list-item-name clickable"
        onClick={() => navigate(`/pokemon/${row.original.pokemonId}`)}
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

  const { tableData, columns } = modifyMovesForUniqueZMoveTable({
    data,
    SpriteComponent,
    NameComponent,
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

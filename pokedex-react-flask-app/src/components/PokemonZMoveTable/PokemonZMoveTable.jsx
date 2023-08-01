import React from "react";
import { useNavigate } from "react-router-dom";

import { formatName } from "../../helpers/format";
import { getItemSprite } from "../../helpers/pictures";
import { handleItemError } from "../../helpers/error";
import { modifyPokemonZMove } from "../../helpers/modifyForTable";

import { Table } from "../";

const PokemonZMoveTable = ({ move }) => {
  const navigate = useNavigate();

  const NameComponent = ({ value, row }) => {
    return (
      <p
        className="move-list-item-name clickable"
        onClick={() => navigate(`/moves/${row.original.id}`)}
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
  const TypeImageComponent = ({ value }) => {
    return (
      <img
        className="table-image clickable"
        src={`/icons/types/${value.name}.png`}
        alt={`${value} icon`}
        onClick={() => navigate(`/types/${value.id}`)}
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

  const { tableData, columns } = modifyPokemonZMove({
    move,
    NameComponent,
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

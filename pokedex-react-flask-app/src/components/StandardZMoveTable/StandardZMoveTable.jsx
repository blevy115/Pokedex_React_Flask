import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_Z_MOVE_BASE_MOVES } from "../../api/queries/pokeapi";

import { modifyMovesForStandardZMoveTable } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";
import { isZMove } from "../../helpers/getZMovePower";

import { Loading, Table } from "../";

const StandardZMoveTable = ({ typeId }) => {
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_Z_MOVE_BASE_MOVES, {
    client: pokemonAPIClient,
    variables: { typeId: typeId },
  });

  if (loading) return <Loading fullscreen={false} />;
  const standardMoves = data.moves.filter((move) => !isZMove(move.id));

  const NameComponent = ({ value, row }) => {
    return (
      <p
        className="move-list-item-name clickable"
        onClick={() => navigate(`/moves/${row.original.moveId}`)}
      >
        {formatName(value)}
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

  const { tableData, columns } = modifyMovesForStandardZMoveTable({
    moves: standardMoves,
    NameComponent,
    KindImageComponent,
  });

  return <Table data={tableData} columns={columns} />;
};

export default StandardZMoveTable;

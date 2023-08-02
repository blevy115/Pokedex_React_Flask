import React from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_Z_MOVE_BASE_MOVES } from "../../api/queries/pokeapi";

import { modifyMovesForStandardZMoveTable } from "../../helpers/modifyForTable";
import { isZMove } from "../../helpers/getZMovePower";

import { Loading, Table } from "../";
import {
  MoveNameComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

const StandardZMoveTable = ({ typeId }) => {
  const { data, loading } = useQuery(GET_Z_MOVE_BASE_MOVES, {
    client: pokemonAPIClient,
    variables: { typeId: typeId },
  });

  if (loading) return <Loading fullscreen={false} />;
  const standardMoves = data.moves.filter((move) => !isZMove(move.id));

  const { tableData, columns } = modifyMovesForStandardZMoveTable({
    moves: standardMoves,
    NameComponent: MoveNameComponent,
    KindImageComponent,
  });

  return <Table data={tableData} columns={columns} />;
};

export default StandardZMoveTable;

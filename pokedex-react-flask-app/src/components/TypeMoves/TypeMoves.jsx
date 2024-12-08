import React, { useMemo } from "react";

import { modifyMoves } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  MoveNameComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

import "./TypeMoves.scss";

const TypeMoves = ({ list, generationId, onlySelectedGen }) => {
  const filteredMoves = useMemo(() => {
    if (generationId === "All") return list;
    return list.filter((move) => {
      const isWithinGen = move.generation_id <= generationId;
      const isExactGen = move.generation_id === generationId;
      return onlySelectedGen ? isExactGen : isWithinGen;
    });
  }, [list, generationId, onlySelectedGen]);

  const { tableData, columns } = modifyMoves({
    moves: filteredMoves.map((move) => ({ moveInfo: move })),
    KindImageComponent,
    NameComponent: MoveNameComponent,
    hasType: false,
    hasGeneration: !onlySelectedGen,
  });

  return <Table data={tableData} columns={columns} />;
};

export default TypeMoves;

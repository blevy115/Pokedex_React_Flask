function modifyMovesForTable({
  moves,
  hasLevel = false,
  TypeImageComponent,
  KindImageComponent,
  PopUpComponent,
}) {
  if (moves.length < 0) return { columns: [], tableData: [] };
  const columns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: PopUpComponent,
    },
    { Header: "Type", accessor: "type", Cell: TypeImageComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "PP", accessor: "pp" },
    { Header: "Accuracy", accessor: "accuracy" },
  ];
  if (hasLevel) {
    columns.unshift({ Header: "Level", accessor: "level" });
  }
  const tableData = moves.map((move, i) => {
    const hasFlavourText = move.moveInfo.flavourText.length > 0;
    const modifiedMove = {
      id: i,
      name: move.moveInfo.name,
      type: move.moveInfo.type.name,
      kind: move.moveInfo.kind.name,
      pp: move.moveInfo.pp,
      accuracy: `${move.moveInfo.accuracy || "—"}%`,
      popupText: hasFlavourText
        ? move.moveInfo.flavourText[0].flavor_text
        : undefined,
    };
    return hasLevel ? { level: move.level, ...modifiedMove } : modifiedMove;
  });
  return { columns, tableData };
}

export { modifyMovesForTable };

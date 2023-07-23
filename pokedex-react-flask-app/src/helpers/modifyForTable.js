function modifyMoves({
  moves,
  hasLevel = false,
  hasPopUpText = false,
  TypeImageComponent,
  KindImageComponent,
  NameComponent,
}) {
  if (moves.length < 0) return { columns: [], tableData: [] };
  const columns = [
    {
      Header: "Name",
      accessor: "name",
      Cell: NameComponent,
    },
    { Header: "Type", accessor: "type", Cell: TypeImageComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
    { Header: "PP", accessor: "pp" },
    { Header: "Accuracy", accessor: "accuracy" },
  ];
  if (hasLevel) {
    columns.unshift({ Header: "Level", accessor: "level" });
  }
  const tableData = moves.map((move, i) => {
    const hasFlavourText = hasPopUpText && move.moveInfo.flavourText.length > 0;
    const modifiedMove = {
      id: i,
      moveId: move.moveInfo.id,
      name: move.moveInfo.name,
      type: move.moveInfo.type.name,
      kind: move.moveInfo.kind.name,
      power: move.moveInfo.power || "—",
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

function modifyPokemon({
  pokemons,
  hasLevelData = false,
  hasHiddenData = false,
  hasItemRarityData = false,
  SpriteComponent,
  NameComponent,
  TypesImageComponent,
  LevelComponent,
  IsHiddenComponent,
}) {
  const columns = [
    { Header: "ID", accessor: "pokemonId" },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Types", accessor: "types", Cell: TypesImageComponent },
  ];
  if (hasLevelData) {
    columns.push({
      Header: "Level",
      accessor: "level",
      Cell: LevelComponent,
    });
  }
  if (hasHiddenData) {
    columns.push({
      Header: "Hidden",
      accessor: "isHidden",
      Cell: IsHiddenComponent,
    });
  }
  if (hasItemRarityData) {
    columns.push({
      Header: "Rarity",
      accessor: "rarity",
    });
  }

  const tableData = pokemons.map((pokemon, i) => {
    const pokemonData = pokemon.pokemon_v2_pokemon;
    const modifiedPokemon = {
      id: i,
      pokemonId: `#${pokemonData.pokemon_species_id}`,
      spriteId: pokemonData.id,
      name: { name: pokemonData.name, id: pokemonData.id },
      types: pokemonData.types,
    };

    if (hasLevelData) return { ...modifiedPokemon, level: pokemon.values };
    if (hasHiddenData)
      return { ...modifiedPokemon, isHidden: pokemon.is_hidden };
    if (hasItemRarityData)
      return { ...modifiedPokemon, rarity: `${pokemon.rarity}%` };
    return modifiedPokemon;
  });
  return { columns, tableData };
}

function modifyStats({ headers, ivs, evs, StatComponent }) {
  const columns = headers.map((stat) => ({
    Header: stat,
    accessor: stat,
    Cell: StatComponent,
  }));
  const tableData = [
    { ...ivs, rowType: "iv" },
    { ...evs, rowType: "ev" },
  ];
  return { columns, tableData };
}

export { modifyMoves, modifyPokemon, modifyStats };

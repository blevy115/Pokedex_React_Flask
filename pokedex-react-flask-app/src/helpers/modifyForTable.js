function modifyMoves({
  moves,
  hasLevel = false,
  hasTms = false,
  hasPopUpText = false,
  TypeImageComponent,
  KindImageComponent,
  NameComponent,
  TmComponent,
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
  if (hasTms) {
    columns.unshift({ Header: "TM", accessor: "tm", Cell: TmComponent });
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
      accuracy: move.moveInfo.accuracy ? `${move.moveInfo.accuracy}%` : "—",
      popupText: hasFlavourText
        ? move.moveInfo.flavourText[0].flavor_text
        : undefined,
    };
    if (hasLevel) {
      return { level: move.level, ...modifiedMove };
    }
    if (hasTms) {
      // Optional Chaining used as Gen 9 TM data not available yet
      return {
        tm: move.moveInfo.tm[0]?.pokemon_v2_item.name || "—",
        ...modifiedMove,
      };
    }
    return modifiedMove;
  });
  return { columns, tableData };
}

function modifyPokemon({
  pokemons,
  hasLevelData = false,
  hasItemRarityData = false,
  hasAbilities = false,
  SpriteComponent,
  NameComponent,
  TypesImageComponent,
  LevelComponent,
  AbilitiesComponent,
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
  if (hasItemRarityData) {
    columns.push({
      Header: "Rarity",
      accessor: "rarity",
    });
  }
  if (hasAbilities) {
    columns.push(
      {
        Header: "Ability 1",
        accessor: "ability-1",
        Cell: AbilitiesComponent,
      },
      {
        Header: "Ability 2",
        accessor: "ability-2",
        Cell: AbilitiesComponent,
      },
      {
        Header: " Hidden Ability",
        accessor: "ability-hidden",
        Cell: AbilitiesComponent,
      }
    );
  }

  const tableData = pokemons.map((pokemon, i) => {
    const pokemonData = pokemon.pokemon_v2_pokemon;
    const modifiedPokemon = {
      id: i,
      pokemonId: `#${pokemonData.pokemon_species_id}`,
      spriteId: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types,
    };

    if (hasLevelData) return { ...modifiedPokemon, level: pokemon.values };
    if (hasItemRarityData)
      return { ...modifiedPokemon, rarity: `${pokemon.rarity}%` };
    if (hasAbilities) {
      const standardAbilities = pokemonData.abilities.filter(
        (ability) => !ability.is_hidden
      );
      const hiddenAbilities = pokemonData.abilities.filter(
        (ability) => ability.is_hidden
      );
      const modifiedAbilities = {};
      modifiedAbilities["ability-1"] = standardAbilities[0].pokemon_v2_ability;
      modifiedAbilities["ability-2"] = standardAbilities[1]
        ?.pokemon_v2_ability || { name: "None" };
      modifiedAbilities["ability-hidden"] = hiddenAbilities[0]
        ?.pokemon_v2_ability || { name: "None" };
      return { ...modifiedPokemon, ...modifiedAbilities };
    }

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

import { getMaxMovePower } from "./maxMoveHelper";
import { getZMovePower } from "./zMoveHelper";
import { formatName } from "./format";

function modifyMoves({
  moves,
  hasLevel = false,
  hasTms = false,
  hasPopUpText = false,
  hasType = true,
  hasGeneration = false,
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
    ...(hasType
      ? [{ Header: "Type", accessor: "type", Cell: TypeImageComponent }]
      : []),
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
    { Header: "PP", accessor: "pp" },
    { Header: "Accuracy", accessor: "accuracy" },
  ];
  if (hasLevel) {
    columns.unshift({ Header: "Level", accessor: "level" });
  }
  if (hasTms) {
    columns.unshift({ Header: "TM", accessor: "tm" });
  }
  if (hasGeneration) {
    columns.unshift({ Header: "Gen", accessor: "gen" });
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
        tm: move.moveInfo.tm[0]?.pokemon_v2_item.name.toUpperCase() || "—",
        ...modifiedMove,
      };
    }
    if (hasGeneration) {
      return { gen: move.moveInfo.generation_id, ...modifiedMove };
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
  hasType = true,
  hasGeneration = false,
  hasStats = false,
  SpriteComponent,
  NameComponent,
  TypesImageComponent,
  LevelComponent,
  AbilitiesComponent,
  pageId,
}) {
  const columns = [
    { Header: "ID", accessor: "pokemonId" },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    ...(hasType
      ? [{ Header: "Types", accessor: "types", Cell: TypesImageComponent }]
      : []),
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
  if (hasGeneration) {
    columns.splice(1, 0, { Header: "Gen", accessor: "gen" });
  }
  if (hasStats) {
    Object.keys(statHeaderModifier).forEach((statKey) => {
      columns.push({
        Header: statHeaderModifier[statKey],
        accessor: statKey,
      });
    });

    columns.push({
      Header: "Total",
      accessor: "total",
    });
  }
  const tableData = pokemons.map((pokemon, i) => {
    const pokemonData = pokemon.pokemon_v2_pokemon;

    const modifiedPokemon = {
      id: i,
      pokemonId: `#${pokemonData.pokemon_species_id}`,
      spriteId: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types,
      pageId: pageId,
    };

    if (hasLevelData) {
      modifiedPokemon.level = pokemon.values;
    }

    if (hasItemRarityData) {
      modifiedPokemon.rarity = `${pokemon.rarity}%`;
    }

    if (hasAbilities) {
      const standardAbilities = pokemonData.abilities.filter(
        (ability) => !ability.is_hidden
      );
      const hiddenAbilities = pokemonData.abilities.filter(
        (ability) => ability.is_hidden
      );
      modifiedPokemon["ability-1"] = standardAbilities[0]
        ?.pokemon_v2_ability || { name: "None" };
      modifiedPokemon["ability-2"] = standardAbilities[1]
        ?.pokemon_v2_ability || { name: "None" };
      modifiedPokemon["ability-hidden"] = hiddenAbilities[0]
        ?.pokemon_v2_ability || { name: "None" };
    }

    if (hasGeneration) {
      modifiedPokemon.gen =
        pokemonData.pokemon_v2_pokemonforms[0].pokemon_v2_versiongroup.generation_id;
    }

    if (hasStats) {
      pokemonData.stats.forEach((stat) => {
        modifiedPokemon[stat.pokemon_v2_stat.name] = stat.base_stat;
      });
      modifiedPokemon.total = pokemonData.stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0
      );
    }

    return modifiedPokemon;
  });

  return { columns, tableData };
}

function modifyMovesForStandardZMoveTable({
  moves,
  NameComponent,
  KindImageComponent,
}) {
  const columns = [
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
    { Header: "Z Power", accessor: "zPower" },
  ];

  const tableData = moves.map((move) => {
    const modifiedMove = {
      moveId: move.id,
      name: move.name,
      kind: move.kind.name,
      power: move.power || "—",
      zPower: getZMovePower({
        id: move.id,
        power: move.power,
        categoryId: move.meta[0].move_meta_category_id,
      }),
    };
    return modifiedMove;
  });
  return { columns, tableData };
}

function modifyPokemonUniqueZMove({
  move,
  NameComponent,
  MoveComponent,
  TypeImageComponent,
  KindImageComponent,
  ItemComponent,
}) {
  const columns = [
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Move", accessor: "move", Cell: MoveComponent },
    { Header: "Type", accessor: "type", Cell: TypeImageComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
    { Header: "Item", accessor: "item", Cell: ItemComponent },
  ];

  const tableData = [{ ...move, moveId: move.id, type: move.type.name }];

  return { columns, tableData };
}

function modifyMovesForUniqueZMoveTable({
  data,
  SpriteComponent,
  NameComponent,
  MoveComponent,
  ItemComponent,
}) {
  const columns = [
    { Header: "ID", accessor: "pokemonId" },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Move", accessor: "move", Cell: MoveComponent },
    { Header: "Item", accessor: "item", Cell: ItemComponent },
  ];

  const tableData = data.pokemon.map((pokemon) => {
    const modifiedPokemon = {
      pokemonId: `#${pokemon.id}`,
      spriteId: pokemon.id,
      name: pokemon.name,
      move: data.move,
      item: data.item,
    };
    return modifiedPokemon;
  });
  return { columns, tableData };
}

function modifyMoveUniqueZMove({
  moves,
  SpriteComponent,
  NameComponent,
  MoveComponent,
  KindImageComponent,
  ItemComponent,
}) {
  const columns = [
    { Header: "ID", accessor: "pokemonId" },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Z-Move", accessor: "zMove", Cell: MoveComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
    { Header: "Item", accessor: "item", Cell: ItemComponent },
  ];

  const tableData = moves.map((move) => {
    const modifiedMove = {
      pokemonId: `#${move.pokemon.id}`,
      spriteId: move.pokemon.id,
      name: move.pokemon.name,
      zMove: { id: move.id, name: move.name },
      kind: move.kind,
      power: move.power,
      item: move.item,
    };
    return modifiedMove;
  });
  return { columns, tableData };
}

function modifyItemUniqueZMove({
  data,
  SpriteComponent,
  NameComponent,
  MoveComponent,
  ZMoveComponent,
  TypeImageComponent,
  KindImageComponent,
}) {
  const columns = [
    { Header: "ID", accessor: "pokemonId" },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Z-Move", accessor: "zMove", Cell: ZMoveComponent },
    { Header: "Move", accessor: "move", Cell: MoveComponent },
    { Header: "Type", accessor: "type", Cell: TypeImageComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
  ];

  const tableData = data.pokemon.map((pokemon) => {
    const modifiedPokemon = {
      pokemonId: `#${pokemon.id}`,
      spriteId: pokemon.id,
      name: pokemon.name,
      zMove: { id: data.id, name: data.name },
      move: data.move,
      type: data.type.name,
      kind: data.kind,
      power: data.power,
    };
    return modifiedPokemon;
  });
  return { columns, tableData };
}

function modifyMovesForMaxMoveTable({
  moves,
  NameComponent,
  KindImageComponent,
  type,
  hasMaxPower = false,
  isGmax = false,
}) {
  const columns = [
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Kind", accessor: "kind", Cell: KindImageComponent },
    { Header: "Power", accessor: "power" },
    ...(!hasMaxPower
      ? [{ Header: isGmax ? "G-Max Power" : "Max Power", accessor: "maxPower" }]
      : []),
  ];

  const tableData = moves.map((move) => {
    const modifiedMove = {
      moveId: move.id,
      name: move.name,
      kind: move.kind.name,
      power: move.power || "—",
      maxPower: !hasMaxPower
        ? getMaxMovePower(
            {
              id: move.id,
              power: move.power,
              categoryId: move.meta[0].move_meta_category_id,
            },
            type
          )
        : null,
    };
    return modifiedMove;
  });
  return { columns, tableData };
}

function modifyItemPokemonEvolution({
  pokemonsList,
  SpriteComponent,
  PreEvolvedNameComponent,
  EvolvedNameComponent,
  TypesImageComponent,
}) {
  const columns = [
    {
      Header: "Pre-Evolved Sprite",
      accessor: "preEvolvedSpriteId",
      Cell: SpriteComponent,
    },
    {
      Header: "Pre-Evolved Name",
      accessor: "preEvolvedName",
      Cell: PreEvolvedNameComponent,
    },
    {
      Header: "Pre-Evolved Types",
      accessor: "preEvolvedTypes",
      Cell: TypesImageComponent,
    },
    {
      Header: "Evolved Sprite",
      accessor: "evolvedSpriteId",
      Cell: SpriteComponent,
    },
    {
      Header: "Evolved Name",
      accessor: "evolvedName",
      Cell: EvolvedNameComponent,
    },
    {
      Header: "Evolved Types",
      accessor: "evolvedTypes",
      Cell: TypesImageComponent,
    },
    { Header: "Trigger", accessor: "trigger" },
  ];
  const tableData = pokemonsList.map((pokemons, i) => {
    const preEvolvedPokemon =
      pokemons.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.find(
        (pokemon) =>
          pokemon.id ===
          pokemons.pokemon_v2_pokemonspecy.evolves_from_species_id
      );

    const evolvedPokemon =
      pokemons.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.find(
        (pokemon) => pokemon.id === pokemons.pokemon_v2_pokemonspecy.id
      );

    const evolution = {
      id: i,
      preEvolvedSpriteId: preEvolvedPokemon.id,
      preEvolvedName: preEvolvedPokemon.name,
      preEvolvedTypes: preEvolvedPokemon.pokemon_v2_pokemons[0].types,
      evolvedSpriteId: evolvedPokemon.id,
      evolvedName: evolvedPokemon.name,
      evolvedTypes: evolvedPokemon.pokemon_v2_pokemons[0].types,
      trigger: `${formatName(pokemons.pokemon_v2_evolutiontrigger.name)}${
        pokemons.time_of_day
          ? ` at ${formatName(pokemons.time_of_day)}time`
          : ""
      }`,
    };
    return evolution;
  });
  return { columns, tableData };
}

function modifyPokemonGMAXMove({ move, NameComponent, TypeImageComponent }) {
  const columns = [
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Type", accessor: "type", Cell: TypeImageComponent },
    { Header: "Effect", accessor: "effect" },
  ];

  const tableData = [{ ...move, moveId: move.id, type: move.type.name }];

  return { columns, tableData };
}

function modifyPokemonEncounters({
  encounters,
  GameComponent,
  LocationsComponent,
}) {
  const columns = [
    { Header: "Game", accessor: "game", Cell: GameComponent },
    { Header: "Locations", accessor: "locations", Cell: LocationsComponent },
  ];
  const tableData = Object.entries(encounters).map(([game, locations]) => ({
    game,
    locations,
  }));
  return { columns, tableData };
}

function modifyLocationEncounters({
  encounters,
  NameComponent,
  GameComponent,
  SpriteComponent,
}) {
  const columns = [
    { Header: "Game", accessor: "game", Cell: GameComponent },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Levels", accessor: "levels" },
    { Header: "Rarity", accessor: "rarity" },
    { Header: "Method", accessor: "method" },
  ];
  const tableData = encounters.map((encounter) => ({
    game: encounter.game,
    spriteId: encounter.pokemon.id,
    name: encounter.pokemon.name,
    levels:
      encounter.minLevel === encounter.maxLevel
        ? encounter.maxLevel
        : `${encounter.minLevel}-${encounter.maxLevel}`,
    rarity: `${encounter.rarity}%`,
    method: formatName(encounter.method),
  }));
  return { columns, tableData };
}

function modifyEggGroupPokemon({
  pokemons,
  SpriteComponent,
  NameComponent,
  TypesImageComponent,
  EggGroupsComponent,
  pageId,
  hasEggGroup = false,
  hasStats = false,
  hasGeneration = false,
}) {
  const columns = [
    { Header: "ID", accessor: "pokemonId" },
    { Header: "Sprite", accessor: "spriteId", Cell: SpriteComponent },
    { Header: "Name", accessor: "name", Cell: NameComponent },
    { Header: "Types", accessor: "types", Cell: TypesImageComponent },
    ...(hasEggGroup
      ? [
          {
            Header: "Egg Groups",
            accessor: "eggGroups",
            Cell: EggGroupsComponent,
          },
        ]
      : []),
  ];
  if (hasGeneration) {
    columns.splice(1, 0, { Header: "Gen", accessor: "gen" });
  }
  if (hasStats) {
    Object.keys(statHeaderModifier).forEach((statKey) => {
      columns.push({
        Header: statHeaderModifier[statKey],
        accessor: statKey,
      });
    });

    columns.push({
      Header: "Total",
      accessor: "total",
    });
  }

  const tableData = pokemons.map((pokemon, i) => {
    const pokemonData = pokemon.pokemon_v2_pokemonspecy;
    const modifiedPokemon = {
      id: i,
      pokemonId: `#${pokemonData.id}`,
      spriteId: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.pokemon[0].types,
      eggGroups: pokemonData.egg_groups,
      pageId: pageId,
    };

    if (hasGeneration) {
      modifiedPokemon.gen = pokemonData.generation_id;
    }

    if (hasStats) {
      pokemonData.pokemon[0].stats.forEach((stat) => {
        modifiedPokemon[stat.pokemon_v2_stat.name] = stat.base_stat;
      });
      modifiedPokemon.total = pokemonData.pokemon[0].stats.reduce(
        (sum, stat) => sum + stat.base_stat,
        0
      );
    }

    return modifiedPokemon;
  });
  return { columns, tableData };
}
const statHeaderModifier = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  "special-attack": "Sp.Atk",
  "special-defense": "Sp.Def",
  speed: "Spe",
};

function modifyStats({ headers, ivs, evs, StatComponent }) {
  const columns = headers.map((stat) => ({
    Header: statHeaderModifier[stat],
    accessor: stat,
    Cell: StatComponent,
  }));

  columns.unshift({
    Header: "",
    accessor: "rowHeader",
  });

  const tableData = [
    { rowHeader: "IVs", ...ivs, rowType: "iv" },
    { rowHeader: "EVs", ...evs, rowType: "ev" },
  ];
  return { columns, tableData };
}

export {
  modifyMoves,
  modifyPokemon,
  modifyStats,
  modifyMovesForStandardZMoveTable,
  modifyMovesForUniqueZMoveTable,
  modifyPokemonUniqueZMove,
  modifyMoveUniqueZMove,
  modifyItemUniqueZMove,
  modifyMovesForMaxMoveTable,
  modifyPokemonGMAXMove,
  modifyItemPokemonEvolution,
  modifyPokemonEncounters,
  modifyLocationEncounters,
  modifyEggGroupPokemon,
};

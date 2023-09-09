function mergeLocationEncounters(encounters) {
  const groupedEncounters = {};

  encounters.forEach((locationArea) => {
    const locationName = locationArea.name;

    locationArea.pokemon_v2_encounters.forEach((encounter) => {
      const generationId =
        encounter.pokemon_v2_encounterslot.pokemon_v2_versiongroup
          .generation_id;
      const versionId = encounter.pokemon_v2_encounterslot.version_group_id;
      const encounterMethodId =
        encounter.pokemon_v2_encounterslot.pokemon_v2_encountermethod.id;
      const pokemonId = encounter.pokemon_v2_pokemon.id;
      const key = `${locationName}-${generationId}-${versionId}-${encounterMethodId}-${pokemonId}`;

      if (!groupedEncounters[key]) {
        groupedEncounters[key] = {
          locationArea: locationName,
          generation: generationId,
          version: versionId,
          gameName:
            encounter.pokemon_v2_encounterslot.pokemon_v2_versiongroup.name,
          pokemon: encounter.pokemon_v2_pokemon,
          minLevel: encounter.min_level,
          maxLevel: encounter.max_level,
          rarity: encounter.pokemon_v2_encounterslot.rarity,
          method:
            encounter.pokemon_v2_encounterslot.pokemon_v2_encountermethod.name,
          slot: encounter.pokemon_v2_encounterslot.slot,
        };
      } else {
        if (
          groupedEncounters[key].slot !==
          encounter.pokemon_v2_encounterslot.slot
        ) {
          groupedEncounters[key].rarity +=
            encounter.pokemon_v2_encounterslot.rarity;
        }
      }
    });
  });

  const finalGroupedEncounters = {};

  for (const key in groupedEncounters) {
    const encounter = groupedEncounters[key];
    if (!finalGroupedEncounters[encounter.generation]) {
      finalGroupedEncounters[encounter.generation] = {};
    }
    if (!finalGroupedEncounters[encounter.generation][encounter.locationArea]) {
      finalGroupedEncounters[encounter.generation][encounter.locationArea] = {};
    }
    if (
      !finalGroupedEncounters[encounter.generation][encounter.locationArea][
        encounter.method
      ]
    ) {
      finalGroupedEncounters[encounter.generation][encounter.locationArea][
        encounter.method
      ] = [];
    }
    finalGroupedEncounters[encounter.generation][encounter.locationArea][
      encounter.method
    ].push({
      pokemon: encounter.pokemon,
      gameName: encounter.gameName,
      minLevel: encounter.minLevel,
      maxLevel: encounter.maxLevel,
      rarity: encounter.rarity,
      slot: encounter.slot,
    });
  }

  return finalGroupedEncounters;
}

function mergePokemonEncounters(encounters) {
  const mergedEncounters = {};

  encounters.forEach((encounter) => {
    const versionGroupName =
      encounter.pokemon_v2_version.pokemon_v2_versiongroup.name;
    const versionGroupId = encounter.pokemon_v2_version.version_group_id;
    const locationId = encounter.pokemon_v2_locationarea.pokemon_v2_location.id;

    const key = `${versionGroupId}-${locationId}`;

    if (!mergedEncounters[key]) {
      mergedEncounters[key] = {
        game: versionGroupName,
        generation:
          encounter.pokemon_v2_version.pokemon_v2_versiongroup.generation_id,
        location: encounter.pokemon_v2_locationarea.pokemon_v2_location.name,
        locationId: locationId,
      };
    }
  });

  const sortedEncounters = {};

  for (const key in mergedEncounters) {
    const encounter = mergedEncounters[key];

    const generation = encounter.generation;
    const game = encounter.game;

    if (!sortedEncounters[generation]) {
      sortedEncounters[generation] = {};
    }

    if (!sortedEncounters[generation][game]) {
      sortedEncounters[generation][game] = [];
    }

    sortedEncounters[generation][game].push({
      name: encounter.location,
      id: encounter.locationId,
    });
  }
  for (const gen in sortedEncounters) {
    for (const game in sortedEncounters[gen]) {
      sortedEncounters[gen][game].sort((a, b) => a.id - b.id);
    }
  }

  return sortedEncounters;
}

export { mergeLocationEncounters, mergePokemonEncounters };

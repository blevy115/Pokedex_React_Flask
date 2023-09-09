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
      sortedEncounters[generation][game] = {
        locations: [],
      };
    }

    sortedEncounters[generation][game].locations.push({
      name: encounter.location,
      id: encounter.locationId,
    });
  }
  for (const gen in sortedEncounters) {
    for (const game in sortedEncounters[gen]) {
      sortedEncounters[gen][game].locations.sort((a, b) => a.id - b.id);
    }
  }

  return sortedEncounters;
}

export { mergePokemonEncounters };

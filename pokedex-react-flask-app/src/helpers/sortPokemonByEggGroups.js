export function sortPokemonByEggGroups({ pokemons, id, byEggGroup = false }) {
  const sorted = pokemons.reduce(
    (acc, cur) => {
      const {
        pokemon_v2_pokemonspecy,
        pokemon_v2_pokemonspecy: { egg_groups },
      } = cur;
      const filteredEggGroups = egg_groups.filter(
        (eggGroup) => eggGroup.pokemon_v2_egggroup.egg_group_id !== id
      );
      if (filteredEggGroups.length === 0) {
        acc[0]["pokemons"].push({ pokemon_v2_pokemonspecy });
      } else {
        if (!byEggGroup) {
          acc[1]["pokemons"].push({ pokemon_v2_pokemonspecy });
        } else {
          if (!acc[filteredEggGroups[0].pokemon_v2_egggroup.egg_group_id]) {
            acc[filteredEggGroups[0].pokemon_v2_egggroup.egg_group_id] = {
              egg_group_name: filteredEggGroups[0].pokemon_v2_egggroup.name,
              pokemons: [{ pokemon_v2_pokemonspecy }],
            };
          } else {
            acc[filteredEggGroups[0].pokemon_v2_egggroup.egg_group_id][
              "pokemons"
            ].push({ pokemon_v2_pokemonspecy });
          }
        }
      }
      return acc;
    },
    byEggGroup
      ? { 0: { egg_group_name: "pure", pokemons: [] } }
      : {
          0: { egg_group_name: "pure", pokemons: [] },
          1: { egg_group_name: "half", pokemons: [] },
        }
  );
  return sorted;
}

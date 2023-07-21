export function sortPokemonByTypes({ pokemons, id, byType = false }) {
  const sorted = pokemons.reduce(
    (acc, cur) => {
      const {
        pokemon_v2_pokemon,
        pokemon_v2_pokemon: { types },
      } = cur;
      const filteredTypes = types.filter(
        (type) => type.type_id !== id
      );
      if (filteredTypes.length === 0) {
        acc[0]["pokemons"].push({pokemon_v2_pokemon});
      } else {
        if (!byType) {
          acc[1]["pokemons"].push({pokemon_v2_pokemon});
        } else {
          if (!acc[filteredTypes[0].type_id]) {
            acc[filteredTypes[0].type_id] = {
              type_name: filteredTypes[0].pokemon_v2_type.name,
              pokemons: [{pokemon_v2_pokemon}],
            };
          } else {
            acc[filteredTypes[0].type_id]["pokemons"].push({pokemon_v2_pokemon});
          }
        }
      }
      return acc;
    },
    byType
      ? { 0: { type_name: "pure", pokemons: [] } }
      : {
          0: { type_name: "pure", pokemons: [] },
          1: { type_name: "half", pokemons: [] },
        }
  );
  return sorted;
}

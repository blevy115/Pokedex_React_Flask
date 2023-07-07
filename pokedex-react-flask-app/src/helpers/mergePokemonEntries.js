function mergePokemonEntries(arr) {
  const merged = arr.reduce((acc, cur) => {
    const pokemon_v2_pokemon = cur.pokemon_v2_pokemon;
    const index = acc.findIndex(
      (obj) => obj.pokemon_v2_pokemon === pokemon_v2_pokemon
    );
    if (index === -1) {
      acc.push({
        pokemon_v2_pokemon: pokemon_v2_pokemon,
        values: [
          {
            level: cur.level,
            pokemon_v2_versiongroup: cur.pokemon_v2_versiongroup,
          },
        ],
      });
    } else {
      acc[index].values.push({
        level: cur.level,
        pokemon_v2_versiongroup: cur.pokemon_v2_versiongroup,
      });
    }
    return acc;
  }, []);

  return merged;
}

export { mergePokemonEntries };

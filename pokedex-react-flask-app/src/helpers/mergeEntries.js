export function mergePokemonEntries(arr) {
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

export function mergePokemonEntriesHeldItems(arr) {
  const merged = arr.reduce((acc, cur) => {
    const {
      pokemon_v2_pokemon: pokemon,
      pokemon_v2_version: {
        pokemon_v2_versiongroup: { generation_id },
      },
      rarity,
    } = cur;
    if (!acc[generation_id]) {
      acc[generation_id] = [
        {
          pokemon,
          rarity,
        },
      ];
    } else {
      const existingItemIndex = acc[generation_id].findIndex(
        (existingItem) => existingItem.pokemon.name === pokemon.name
      );
      if (existingItemIndex === -1) {
        acc[generation_id].push({
          pokemon,
          rarity,
        });
      } else if (rarity > acc[generation_id][existingItemIndex].rarity) {
        acc[generation_id][existingItemIndex] = {
          pokemon,
          rarity,
        };
      }
    }
    return acc;
  }, {});

  return merged;
}

export function mergeTmEntries(arr) {
  const merged = arr.reduce((acc, cur) => {
    const machine = cur.pokemon_v2_item.name;
    const game = cur.pokemon_v2_versiongroup.name;
    const generation_id = cur.pokemon_v2_versiongroup.generation_id;
    if (!acc[generation_id]) {
      acc[generation_id] = [
        {
          game,
          machine,
        },
      ];
    } else {
      acc[generation_id].push({
        game,
        machine,
      });
    }
    return acc;
  }, {});

  return merged;
}

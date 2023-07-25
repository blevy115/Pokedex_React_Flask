import { gql } from "@apollo/client";

const GET_POKEMON_INFO = gql`
  query getPokemonInfo($id: Int!) {
    pokemon_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight
      pokemon_species_id
      info: pokemon_v2_pokemonspecy {
        has_gender_differences
        gender_rate
        is_legendary
        is_mythical
        is_baby
        pokedexes: pokemon_v2_pokemondexnumbers {
          pokedex_number
          pokemon_v2_pokedex {
            name
          }
        }
      }

      form: pokemon_v2_pokemonforms {
        pokemon_v2_versiongroup {
          generation_id
        }
      }

      types: pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }

      stats: pokemon_v2_pokemonstats {
        base_stat
        effort
        pokemon_v2_stat {
          name
          id
        }
      }

      abilities: pokemon_v2_pokemonabilities(distinct_on: ability_id) {
        pokemon_v2_ability {
          name
          id
          flavor: pokemon_v2_abilityflavortexts(
            where: { pokemon_v2_language: { name: { _eq: "en" } } }
            distinct_on: language_id
          ) {
            text: flavor_text
          }
          text: pokemon_v2_abilityeffecttexts(
            where: { pokemon_v2_language: { name: { _eq: "en" } } }
          ) {
            short_effect
          }
        }
        is_hidden
      }

      held_items: pokemon_v2_pokemonitems(
        where: {
          pokemon_v2_pokemon: {
            pokemon_v2_pokemonforms: { is_mega: { _eq: false } }
          }
        }
      ) {
        rarity
        pokemon_v2_item {
          name
          id
        }
        pokemon_v2_version {
          pokemon_v2_versiongroup {
            generation_id
            name
          }
        }
      }
    }
  }
`;

const GET_POKEMON_MOVES = gql`
  query getPokemonMoveInfo(
    $id: Int!
    $generationId: Int!
    $moveLearnMethodId: Int!
  ) {
    pokemon_move_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      moves: pokemon_v2_pokemonmoves(
        where: {
          pokemon_id: { _eq: $id }
          pokemon_v2_movelearnmethod: { id: { _eq: $moveLearnMethodId } }
          pokemon_v2_versiongroup: { generation_id: { _eq: $generationId } }
        }
        order_by: { move_id: asc, level: asc }
        distinct_on: [move_id, level]
      ) {
        moveInfo: pokemon_v2_move {
          id
          name
          pp
          accuracy
          power
          kind: pokemon_v2_movedamageclass {
            name
          }
          type: pokemon_v2_type {
            name
          }
          flavourText: pokemon_v2_moveflavortexts(
            where: { pokemon_v2_language: { name: { _eq: "en" } } }
            distinct_on: language_id
          ) {
            flavor_text
          }
        }
        level
      }
    }
  }
`;

const GET_POKEMON_LIST_BY_NAME = gql`
  query getPokemonList($name: String!) {
    pokemon_list: pokemon_v2_pokemon(
      where: { name: { _ilike: $name } }
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_species_id
      types: pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

const GET_POKEMON_LIST_BY_ID = gql`
  query getPokemonList($id: Int!) {
    pokemon_list: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      pokemon_species_id
      types: pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

//Item Category is Dynamax Crystals which are Event Only / Unobtainable
const GET_ITEMS_LIST_BY_NAME = gql`
  query getItemList($name: String!) {
    items_list: pokemon_v2_item(
      where: { name: { _ilike: $name }, item_category_id: { _neq: 49 } }
      order_by: { name: asc }
    ) {
      id
      name
    }
  }
`;

// Removes Shadow Type Moves
const GET_MOVES_LIST_BY_NAME = gql`
  query getMovesList($name: String!) {
    moves_list: pokemon_v2_move(
      where: { name: { _ilike: $name }, type_id: { _neq: 10002 } }
      order_by: { name: asc }
    ) {
      id
      name
      kind: pokemon_v2_movedamageclass {
        name
      }
      type: pokemon_v2_type {
        name
      }
    }
  }
`;

const GET_ABILITIES_LIST_BY_NAME = gql`
  query getAbilityList($name: String!) {
    abilities_list: pokemon_v2_ability(
      where: { name: { _ilike: $name }, is_main_series: { _eq: true } }
      order_by: { name: asc }
    ) {
      id
      name
    }
  }
`;

const GET_MOVE_INFO = gql`
  query getMoveInfo($id: Int!) {
    move: pokemon_v2_move(where: { id: { _eq: $id } }) {
      name
      generation_id
      pp
      accuracy
      power
      flavor: pokemon_v2_moveflavortexts(
        where: { pokemon_v2_language: { name: { _eq: "en" } } }
        distinct_on: language_id
      ) {
        text: flavor_text
      }
      kind: pokemon_v2_movedamageclass {
        name
      }
      type: pokemon_v2_type {
        name
        id
      }
      tm: pokemon_v2_machines(distinct_on: version_group_id) {
        machine_number
        pokemon_v2_versiongroup {
          name
          generation_id
        }
        version_group_id
        pokemon_v2_item {
          name
        }
      }
    }
  }
`;

const GET_ABILITY_INFO = gql`
  query getAbilityInfo($id: Int!) {
    ability: pokemon_v2_ability(where: { id: { _eq: $id } }) {
      name
      generation_id
      flavor: pokemon_v2_abilityflavortexts(
        where: { pokemon_v2_language: { name: { _eq: "en" } } }
        distinct_on: language_id
      ) {
        text: flavor_text
      }
      effect_text: pokemon_v2_abilityeffecttexts(
        where: { pokemon_v2_language: { name: { _eq: "en" } } }
      ) {
        effect
      }
    }
  }
`;

const GET_ITEM_INFO = gql`
  query getItemInfo($id: Int!) {
    item: pokemon_v2_item(where: { id: { _eq: $id } }) {
      name
      category: pokemon_v2_itemcategory {
        id
        name
      }
      flavor: pokemon_v2_itemflavortexts(
        where: { pokemon_v2_language: { name: { _eq: "en" } } }
        distinct_on: language_id
      ) {
        text: flavor_text
      }
      held_by_pokemon: pokemon_v2_pokemonitems(
        where: {
          pokemon_v2_pokemon: {
            pokemon_v2_pokemonforms: { is_mega: { _eq: false } }
          }
        }
      ) {
        pokemon_v2_pokemon {
          name
          id
          pokemon_species_id
          types: pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
              id
            }
          }
        }
        rarity
        pokemon_v2_version {
          pokemon_v2_versiongroup {
            generation_id
            name
          }
        }
      }
    }
  }
`;

const GET_ABILITY_POKEMONS = gql`
  query getAbilityPokemons($id: Int!) {
    ability: pokemon_v2_ability(where: { id: { _eq: $id } }) {
      pokemons: pokemon_v2_pokemonabilities(
        order_by: { id: asc, pokemon_v2_pokemon: { pokemon_species_id: asc } }
      ) {
        is_hidden
        pokemon_v2_pokemon {
          id
          name
          pokemon_species_id
          abilities: pokemon_v2_pokemonabilities {
            is_hidden
            id
            pokemon_v2_ability {
              name
              id
            }
            ability_id
          }
          types: pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
              id
            }
          }
        }
      }
    }
  }
`;

const GET_MOVE_POKEMONS = gql`
  query getMovePokemons(
    $id: Int!
    $moveLearnMethodId: Int!
    $generationId: Int!
  ) {
    move: pokemon_v2_move(where: { id: { _eq: $id } }) {
      pokemons: pokemon_v2_pokemonmoves(
        where: {
          move_learn_method_id: { _eq: $moveLearnMethodId }
          pokemon_v2_versiongroup: { generation_id: { _eq: $generationId } }
        }
        order_by: { id: asc, pokemon_v2_pokemon: { pokemon_species_id: asc } }
      ) {
        version_group_id
        pokemon_v2_versiongroup {
          generation_id
          name
        }
        level
        pokemon_v2_pokemon {
          id
          name
          pokemon_species_id
          types: pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
              id
            }
          }
        }
      }
      pokemon_v2_machines(
        where: {
          pokemon_v2_versiongroup: { generation_id: { _eq: $generationId } }
        }
        distinct_on: machine_number
      ) {
        machine_number
        pokemon_v2_versiongroup {
          name
        }
      }
    }
  }
`;

const GET_TYPE_INFO = gql`
  query getTypeInfo($id: Int!) {
    pokemon_v2_type(where: { id: { _eq: $id } }) {
      name
      id
      moves: pokemon_v2_moves {
        id
        name
        generation_id
        pp
        accuracy
        power
        type: pokemon_v2_type {
          name
        }
        kind: pokemon_v2_movedamageclass {
          name
        }
      }
      pokemons: pokemon_v2_pokemontypes(
        order_by: { id: asc, pokemon_v2_pokemon: { pokemon_species_id: asc } }
      ) {
        pokemon_v2_pokemon {
          name
          id
          pokemon_species_id
          types: pokemon_v2_pokemontypes {
            type_id
            pokemon_v2_type {
              name
              id
            }
          }
        }
      }
    }
  }
`;

export {
  GET_POKEMON_INFO,
  GET_POKEMON_MOVES,
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
  GET_MOVES_LIST_BY_NAME,
  GET_MOVE_INFO,
  GET_ABILITIES_LIST_BY_NAME,
  GET_ABILITY_INFO,
  GET_ITEMS_LIST_BY_NAME,
  GET_ITEM_INFO,
  GET_MOVE_POKEMONS,
  GET_ABILITY_POKEMONS,
  GET_TYPE_INFO,
};

// const GET_DEFAULT_POKEMON_LIST_BY_ID = gql`
//   query getPokemonList($id: Int!) {
//     pokemon_list: pokemon_v2_pokemon(where: { id: { _eq: $id }, is_default: {_eq: true} }) {
//       id
//       name
//       types: pokemon_v2_pokemontypes {
//         pokemon_v2_type {
//           name
//           id
//         }
//       }
//     }
//   }
// `;

//Older COde, might be usefull in the future

// pokemon_v2_pokedexversiongroups(distinct_on: version_group_id) {
//   pokemon_v2_versiongroup {
//     generation_id
//   }
// }

// generations: pokemon_v2_generation {
//   id
//   available: pokemon_v2_pokemonformgenerations(where: { pokemon_v2_pokemonform: {pokemon_id: {_eq: $id}}}) {
//     id
//   }
// }

// move: pokemon_v2_move(where: { id: { _eq: $id } }) {
//   pokemons: pokemon_v2_pokemonmoves(
//     distinct_on: [pokemon_id, level]
//     where: {

// flavor: pokemon_v2_abilityflavortexts(where:
//   {pokemon_v2_language: {name: {_eq: "en"}}, pokemon_v2_versiongroup: {generation_id: {_eq: 8}}
// })

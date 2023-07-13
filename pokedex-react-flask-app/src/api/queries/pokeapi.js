import { gql } from "@apollo/client";

const GET_POKEMON_INFO = gql`
  query getPokemonInfo($id: Int!) {
    pokemon_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight

      info: pokemon_v2_pokemonspecy {
        has_gender_differences
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
          text: pokemon_v2_abilityeffecttexts(
            where: { pokemon_v2_language: { name: { _eq: "en" } } }
          ) {
            short_effect
          }
        }
        is_hidden
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
      types: pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }
    }
  }
`;

const GET_MOVES_LIST_BY_NAME = gql`
  query getMovesList($name: String!) {
    moves_list: pokemon_v2_move(
      where: { name: { _ilike: $name } }
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

export {
  GET_POKEMON_INFO,
  GET_POKEMON_MOVES,
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
  GET_MOVES_LIST_BY_NAME,
  GET_MOVE_INFO,
  GET_MOVE_POKEMONS,
};

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

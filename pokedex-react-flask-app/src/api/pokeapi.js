import { gql } from "@apollo/client";

const GET_POKEMON_INFO = gql`
  query getPokemonInfo($id: Int!) {
    pokemon_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name

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
  query getPokemonMoveInfo($id: Int!, $generationId: Int!) {
    pokemon_move_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      level_moves: pokemon_v2_pokemonmoves(
        where: {
          pokemon_id: { _eq: $id }
          pokemon_v2_movelearnmethod: { name: { _eq: "level-up" } }
          pokemon_v2_versiongroup: { generation_id: { _eq: $generationId } }
        }
        order_by: { move_id: asc, level: asc }
        distinct_on: [move_id, level]
      ) {
        moveInfo: pokemon_v2_move {
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
      egg_moves: pokemon_v2_pokemonmoves(
        where: {
          pokemon_id: { _eq: $id }
          pokemon_v2_movelearnmethod: { name: { _eq: "egg" } }
          pokemon_v2_versiongroup: { generation_id: { _eq: $generationId } }
        }
        distinct_on: move_id
      ) {
        moveInfo: pokemon_v2_move {
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
      }
      tm_moves: pokemon_v2_pokemonmoves(
        where: {
          pokemon_id: { _eq: $id }
          pokemon_v2_movelearnmethod: { name: { _eq: "machine" } }
          pokemon_v2_versiongroup: { generation_id: { _eq: $generationId } }
        }
        distinct_on: move_id
      ) {
        moveInfo: pokemon_v2_move {
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
      }
    }
  }
`;

const GET_POKEMON_LIST_BY_NAME = gql`
  query GetPokemonList($name: String!) {
    pokemon_list: pokemon_v2_pokemon(
      where: { name: { _ilike: $name } }
      order_by: { id: asc }
    ) {
      id
      name
    }
  }
`;

const GET_POKEMON_LIST_BY_ID = gql`
  query GetPokemonList($id: Int!) {
    pokemon_list: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name
    }
  }
`;

export {
  GET_POKEMON_INFO,
  GET_POKEMON_MOVES,
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
};

// pokemon_v2_pokedexversiongroups(distinct_on: version_group_id) {
//   pokemon_v2_versiongroup {
//     generation_id
//   }
// }

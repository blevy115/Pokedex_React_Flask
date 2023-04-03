import { gql } from "@apollo/client";

const GET_POKEMON_INFO = gql`
  query getPokemonInfo($id: Int!) {
    pokemon_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name

      info: pokemon_v2_pokemonspecy {
        generation_id
        has_gender_differences
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

      level_moves: pokemon_v2_pokemonmoves(
        where: {
          pokemon_id: { _eq: $id }
          pokemon_v2_movelearnmethod: { name: { _eq: "level-up" } }
        }
        distinct_on: move_id
      ) {
        moveInfo: pokemon_v2_move {
          name
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
        }
        distinct_on: move_id
      ) {
        moveInfo: pokemon_v2_move {
          name
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
        }
        distinct_on: move_id
      ) {
        moveInfo: pokemon_v2_move {
          name
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
      order_by: { name: asc }
    ) {
      id
      name
    }
  }
`;

const GET_POKEMON_LIST_BY_ID = gql`
  query GetPokemonList($id: Int!) {
    pokemon_list: pokemon_v2_pokemon(
      where: { id: { _eq: $id } }
    ) {
      id
      name
    }
  }
`;

export { GET_POKEMON_INFO, GET_POKEMON_LIST_BY_NAME, GET_POKEMON_LIST_BY_ID };

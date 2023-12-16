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
        capture_rate
        forms: pokemon_v2_pokemons {
          id
          pokemon_v2_pokemonforms {
            id
            name
            form_name
            pokemon_id
            pokemon_v2_pokemonformsprites {
              sprites
            }
          }
        }
        pokedexes: pokemon_v2_pokemondexnumbers {
          pokedex_number
          pokemon_v2_pokedex {
            name
          }
        }
        evolutionChain: pokemon_v2_evolutionchain {
          id
          pokemon_v2_pokemonspecies(order_by: { order: asc }) {
            name
            id
            pokemon_v2_pokemonevolutions {
              id
              pokemon_v2_evolutiontrigger {
                name
                id
              }
              pokemon_v2_location {
                id
                name
                pokemon_v2_region {
                  name
                }
              }
              relative_physical_stats
              min_happiness
              time_of_day
              turn_upside_down
              needs_overworld_rain
              min_beauty
              pokemon_v2_item {
                name
                id
              }
              min_level
              pokemon_v2_move {
                name
                id
              }
              pokemon_v2_gender {
                id
                name
              }
              pokemonV2ItemByHeldItemId {
                name
                id
              }
              pokemonV2TypeByPartyTypeId {
                name
                id
              }
              pokemonV2PokemonspecyByPartySpeciesId {
                name
                id
              }
              pokemonV2PokemonspecyByTradeSpeciesId {
                name
                id
              }
            }
            evolves_from_species_id
          }
          baby_trigger_item_id
        }
        egg_groups: pokemon_v2_pokemonegggroups {
          pokemon_v2_egggroup {
            id
            name
          }
        }
      }

      form: pokemon_v2_pokemonforms {
        form_name
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

      abilities: pokemon_v2_pokemonabilities(order_by: { id: asc }) {
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
      encounters: pokemon_v2_encounters(
        order_by: { location_area_id: asc, version_id: asc }
        distinct_on: [location_area_id, version_id]
      ) {
        pokemon_v2_version {
          id
          name
          pokemon_v2_versiongroup {
            generation_id
          }
        }
        pokemon_v2_locationarea {
          pokemon_v2_location {
            id
            name
          }
        }
      }
    }
  }
`;

const GET_TEAM_POKEMON_INFO = gql`
  query getPokemonInfo($id: Int!) {
    pokemon_details: pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
      id
      name

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

      moves: pokemon_v2_pokemonmoves(distinct_on: move_id) {
        pokemon_v2_move {
          id
          name
          pp
          accuracy
          power
          kind: pokemon_v2_movedamageclass {
            name
          }
          type: pokemon_v2_type {
            id
            name
          }
        }
      }

      abilities: pokemon_v2_pokemonabilities(order_by: { id: asc }) {
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
    }
    items: pokemon_v2_item(
      where: { pokemon_v2_itemattributemaps: { item_attribute_id: { _eq: 5 } } }
    ) {
      id
      name
    }
  }
`;

// Change Distinct on for pokemon_v2_machines once function is made to sort TMS by game
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
          tm: pokemon_v2_machines(
            where: {
              pokemon_v2_versiongroup: {
                pokemon_v2_generation: { id: { _eq: $generationId } }
              }
            }
            distinct_on: machine_number
          ) {
            machine_number
            pokemon_v2_item {
              name
            }
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
      stats: pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
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
      stats: pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
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
      where: {
        name: { _ilike: $name, _nregex: "(--special)" }
        type_id: { _neq: 10002 }
      }
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

const GET_LOCATIONS_LIST_BY_NAME = gql`
  query getLocationsList($name: String!) {
    locations_list: pokemon_v2_location(
      where: { name: { _ilike: $name } }
      order_by: { name: asc }
    ) {
      id
      name
    }
  }
`;

const GET_LOCATION_INFO = gql`
  query getLocationnfo($id: Int!) {
    location: pokemon_v2_location(where: { id: { _eq: $id } }) {
      id
      name
      pokemon_v2_region {
        name
        id
      }
      pokemon_v2_locationareas {
        name
        id
        pokemon_v2_encounters {
          id
          pokemon_v2_pokemon {
            name
            id
          }
          pokemon_v2_version {
            name
            id
          }
          min_level
          max_level
          pokemon_v2_encounterslot {
            pokemon_v2_encountermethod {
              name
              id
            }
            rarity
            slot
            pokemon_v2_versiongroup {
              generation_id
            }
          }
        }
      }
      evolutions: pokemon_v2_pokemonevolutions {
        evolved_species_id
        pokemon_v2_evolutiontrigger {
          name
          id
        }
        pokemon_v2_pokemonspecy {
          name
          id
          evolves_from_species_id
          pokemon_v2_evolutionchain {
            pokemon_v2_pokemonspecies {
              name
              id
              pokemon_v2_pokemons {
                id
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
      }
    }
  }
`;

const GET_MOVE_INFO = gql`
  query getMoveInfo($id: Int!) {
    move: pokemon_v2_move(where: { id: { _eq: $id } }) {
      id
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
        id
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
      meta: pokemon_v2_movemeta {
        move_meta_category_id
        pokemon_v2_movemetacategory {
          name
        }
      }
      gmax: pokemon_v2_moveflavortexts(
        where: {
          flavor_text: { _nsimilar: "%that this move is forgotten%" }
          pokemon_v2_language: { name: { _eq: "en" } }
          version_group_id: { _eq: 20 }
          move_id: {
            _nin: [158, 165, 166, 448, 449, 464, 465, 547, 593, 600, 617, 621]
          }
        }
      ) {
        flavor_text
      }
    }
  }
`;

// 728 is the last moveID for Ultra Sun / Moon
const GET_Z_MOVE_BASE_MOVES = gql`
  query getZMoveBaseMoves($typeId: Int!) {
    moves: pokemon_v2_move(
      where: {
        type_id: { _eq: $typeId }
        move_damage_class_id: { _in: [2, 3] }
        id: { _lte: 728 }
        name: { _nregex: "(--physical|--special)" }
      }
      order_by: { name: asc }
    ) {
      name
      id
      power
      kind: pokemon_v2_movedamageclass {
        name
      }
      meta: pokemon_v2_movemeta {
        move_meta_category_id
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
      evolution_pokemon: pokemon_v2_pokemonevolutions {
        id
        evolved_species_id
        evolution_item_id
        pokemon_v2_evolutiontrigger {
          name
          id
        }
        pokemon_v2_pokemonspecy {
          evolves_from_species_id
          id
          pokemon_v2_evolutionchain {
            pokemon_v2_pokemonspecies {
              id
              name
              pokemon_v2_pokemons {
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
          }
          pokemon_v2_pokemonevolutions {
            evolution_item_id
          }
          name
        }
      }
      held_evolution_pokemon: pokemonV2PokemonevolutionsByHeldItemId {
        id
        evolved_species_id
        pokemon_v2_evolutiontrigger {
          name
          id
        }
        pokemon_v2_pokemonspecy {
          evolves_from_species_id
          id
          pokemon_v2_evolutionchain {
            pokemon_v2_pokemonspecies {
              id
              name
              pokemon_v2_pokemons {
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
          }
          pokemon_v2_pokemonevolutions {
            held_item_id
          }
          name
        }
        time_of_day
      }
    }
  }
`;

const GET_ABILITY_POKEMONS = gql`
  query getAbilityPokemons($id: Int!) {
    ability: pokemon_v2_ability(where: { id: { _eq: $id } }) {
      id
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
      moves: pokemon_v2_moves(where: { name: { _nregex: "(--special)" } }) {
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

const GET_EGG_GROUP_INFO = gql`
  query getEggMoveInfo($id: Int!) {
    pokemon_v2_egggroup(where: { id: { _eq: $id } }) {
      id
      name
      pokemons: pokemon_v2_pokemonegggroups {
        id
        pokemon_v2_pokemonspecy {
          name
          id
          egg_groups: pokemon_v2_pokemonegggroups {
            pokemon_v2_egggroup {
              name
              egg_group_id: id
            }
          }
          pokemon: pokemon_v2_pokemons {
            id
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
  }
`;

const GET_MAX_MOVES_LIST = gql`
  query getGen8Moves($id: Int!, $typeId: Int!) {
    pokemon_v2_move(
      where: {
        type_id: { _eq: $typeId }
        move_damage_class_id: { _in: [2, 3] }
        pokemon_v2_moveflavortexts: {
          flavor_text: { _nsimilar: "%that this move is forgotten%" }
          pokemon_v2_language: { name: { _eq: "en" } }
          version_group_id: { _eq: 20 }
        }
        id: {
          _nin: [
            158
            165
            166
            448
            449
            464
            465
            547
            593
            600
            617
            621
            $id
          ]
        }
      }
      order_by: { name: asc }
    ) {
      name
      id
      power
      kind: pokemon_v2_movedamageclass {
        name
      }
      meta: pokemon_v2_movemeta {
        move_meta_category_id
      }
    }
  }
`;

const GET_G_MAX_MOVES_LIST = gql`
  query getGen8Moves($typeId: Int!, $speciesId: Int!) {
    pokemon_v2_move(
      where: {
        type_id: { _eq: $typeId }
        move_damage_class_id: { _in: [2, 3] }
        pokemon_v2_moveflavortexts: {
          flavor_text: { _nsimilar: "%that this move is forgotten%" }
          pokemon_v2_language: { name: { _eq: "en" } }
          version_group_id: { _eq: 20 }
        }
        id: {
          _nin: [158, 165, 166, 448, 449, 464, 465, 547, 593, 600, 617, 621]
        }
        pokemon_v2_pokemonmoves: {
          pokemon_v2_pokemon: { pokemon_species_id: { _eq: $speciesId } }
        }
      }
      order_by: { name: asc }
    ) {
      name
      id
      power
      kind: pokemon_v2_movedamageclass {
        name
      }
      meta: pokemon_v2_movemeta {
        move_meta_category_id
      }
    }
  }
`;

export {
  GET_POKEMON_INFO,
  GET_POKEMON_MOVES,
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
  GET_TEAM_POKEMON_INFO,
  GET_MOVES_LIST_BY_NAME,
  GET_MOVE_INFO,
  GET_Z_MOVE_BASE_MOVES,
  GET_ABILITIES_LIST_BY_NAME,
  GET_ABILITY_INFO,
  GET_ITEMS_LIST_BY_NAME,
  GET_ITEM_INFO,
  GET_EGG_GROUP_INFO,
  GET_LOCATIONS_LIST_BY_NAME,
  GET_LOCATION_INFO,
  GET_MOVE_POKEMONS,
  GET_ABILITY_POKEMONS,
  GET_TYPE_INFO,
  GET_MAX_MOVES_LIST,
  GET_G_MAX_MOVES_LIST,
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

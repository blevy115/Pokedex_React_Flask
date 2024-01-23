import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        email
        id
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation logoutMutation {
    logout {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signupMutation($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
      user {
        name
        email
        id
      }
    }
  }
`;

const GET_USER_POKEMONS = gql`
  query getUserPokemons($user_id: String!) {
    userPokemons(userId: $user_id, orderBy: "pokemonId") {
      pokemons {
        pokemonId
        name
      }
      isActive
    }
  }
`;

const GET_USER_POKEMON_SHINY_COUNT = gql`
  query getUserPokemonShinyCount($user_id: String!, $pokemon_id: Int!) {
    userPokemonShinyCount(userId: $user_id, pokemonId: $pokemon_id) {
      shinyCounter
    }
  }
`;

const GET_USER_TEAMS = gql`
  query getUserTeams($user_id: String!) {
    userTeams(userId: $user_id) {
      name
      teamId
      pokemons {
        position
        moves {
          position
          move {
            name
            moveId
            typeId
          }
        }
        pokemon {
          name
          pokemonId
        }
        ability {
          name
          abilityId
        }
        item {
          name
          itemId
        }
      }
    }
  }
`;

const GET_USER_TEAM = gql`
  query getUserTeam($user_id: String!, $team_id: Int!) {
    team: userTeam(userId: $user_id, teamId: $team_id) {
      name
      pokemons {
        position
        moves {
          position
          move {
            name
            moveId
            typeId
          }
        }
        pokemon {
          name
          pokemonId
          baseStats
          type1Id
          type2Id
        }
        ability {
          name
          abilityId
        }
        item {
          name
          itemId
        }
        nature {
          name
          natureId
        }
        teraType {
          name
          typeId
        }
        stats
        ivs
        evs
      }
    }
  }
`;

const POKEMON_MUTATION = gql`
  mutation pokemonMutation(
    $name: String!
    $pokemon_id: Int!
    $types: [Int!]!
    $base_stats: [Int!]!
  ) {
    mutatePokemon(
      name: $name
      pokemonId: $pokemon_id
      types: $types
      baseStats: $base_stats
    ) {
      pokemon {
        name
        pokemonId
        type1Id
        type2Id
        baseStats
      }
    }
  }
`;

const MOVE_MUTATION = gql`
  mutation moveMutation($name: String!, $move_id: Int!, $type_id: Int!) {
    mutateMove(name: $name, moveId: $move_id, typeId: $type_id) {
      move {
        name
        moveId
        typeId
      }
    }
  }
`;

const ABILITY_MUTATION = gql`
  mutation abilityMutation($name: String!, $ability_id: Int!) {
    mutateAbility(name: $name, abilityId: $ability_id) {
      ability {
        name
        abilityId
      }
    }
  }
`;

const LOCATION_MUTATION = gql`
  mutation locationMutation($name: String!, $location_id: Int!) {
    mutateLocation(name: $name, locationId: $location_id) {
      location {
        name
        locationId
      }
    }
  }
`;

const ITEM_MUTATION = gql`
  mutation itemMutation($name: String!, $item_id: Int!) {
    mutateItem(name: $name, itemId: $item_id) {
      item {
        name
        itemId
      }
    }
  }
`;

const USER_TEAM_MUTATION = gql`
  mutation createUserTeam(
    $user_id: String!
    $team_id: Int
    $name: String!
    $pokemons: [TeamPokemonInput!]!
  ) {
    mutateTeam(
      userId: $user_id
      teamId: $team_id
      name: $name
      pokemons: $pokemons
    ) {
      team {
        id
        name
        userId
        teamId
        pokemons {
          pokemonId
          moves {
            position
            move {
              moveId
              typeId
            }
          }
          abilityId
          itemId
          natureId
          teraTypeId
          position
          stats
          ivs
          evs
        }
      }
    }
  }
`;

const USER_POKEMON_MUTATION = gql`
  mutation userPokemonMutation(
    $user_id: String!
    $pokemon_id: Int!
    $is_active: Boolean!
  ) {
    mutateUserPokemon(
      userId: $user_id
      pokemonId: $pokemon_id
      isActive: $is_active
    ) {
      userPokemon {
        pokemonId
      }
    }
  }
`;

const SHINY_COUNTER_MUTATION = gql`
  mutation shinyCounterMutation(
    $user_id: String!
    $pokemon_id: Int!
    $operation: String!
    $value: Int
  ) {
    mutateShinyCounter(
      userId: $user_id
      pokemonId: $pokemon_id
      operation: $operation
      value: $value
    ) {
      userPokemon {
        pokemonId
      }
    }
  }
`;

const GET_NATURES = gql`
  query getNatures {
    natures(orderBy: "name") {
      id
      natureId
      name
      increasedStat
      decreasedStat
    }
  }
`;

const GET_TYPES = gql`
  query getTypes {
    types(orderBy: "typeId") {
      name
      typeId
    }
  }
`;

const GET_EGG_GROUPS = gql`
  query getEggGroups {
    eggGroups(orderBy: "eggGroupId") {
      name
      eggGroupId
    }
  }
`;

export {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SIGNUP_MUTATION,
  POKEMON_MUTATION,
  MOVE_MUTATION,
  ABILITY_MUTATION,
  ITEM_MUTATION,
  LOCATION_MUTATION,
  USER_POKEMON_MUTATION,
  GET_USER_POKEMONS,
  GET_USER_POKEMON_SHINY_COUNT,
  USER_TEAM_MUTATION,
  SHINY_COUNTER_MUTATION,
  GET_NATURES,
  GET_TYPES,
  GET_EGG_GROUPS,
  GET_USER_TEAMS,
  GET_USER_TEAM,
};

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

const POKEMON_MUTATION = gql`
  mutation pokemonMutation($name: String!, $pokemon_id: Int!) {
    mutatePokemon(name: $name, pokemonId: $pokemon_id) {
      pokemon {
        name
        pokemonId
      }
    }
  }
`;

const MOVE_MUTATION = gql`
  mutation moveMutation($name: String!, $move_id: Int!) {
    mutateMove(name: $name, moveId: $move_id) {
      move {
        name
        moveId
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

export {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SIGNUP_MUTATION,
  POKEMON_MUTATION,
  MOVE_MUTATION,
  ABILITY_MUTATION,
  ITEM_MUTATION,
  USER_POKEMON_MUTATION,
  GET_USER_POKEMONS,
  GET_USER_POKEMON_SHINY_COUNT,
  SHINY_COUNTER_MUTATION,
  GET_NATURES,
  GET_TYPES,
};

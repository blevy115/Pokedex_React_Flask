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

const CHECK_POKEMON_EXISTS = gql`
  query checkPokemonExists($pokemon_id: Int!) {
    pokemons(pokemonId: $pokemon_id) {
      id
      name
      pokemonId
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

export {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  SIGNUP_MUTATION,
  POKEMON_MUTATION,
  USER_POKEMON_MUTATION,
  CHECK_POKEMON_EXISTS,
  GET_USER_POKEMONS,
  SHINY_COUNTER_MUTATION,
  GET_NATURES,
};

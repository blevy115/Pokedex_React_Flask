import { gql } from "@apollo/client";

const GET_USERS_LIST = gql`
  query {
    users {
      id
      name
    }
}`;

const GET_SAVE_POKEMON = gql`
query{
    pokemons{
        name
    }
}`

export { GET_USERS_LIST, GET_SAVE_POKEMON }
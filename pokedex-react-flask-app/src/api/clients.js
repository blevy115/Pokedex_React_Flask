import { ApolloClient, InMemoryCache } from "@apollo/client";

function getKeyFields(existing, { generationId }) {
  if (generationId) {
    return ["id", "generationId"];
  }
  return ["id"];
}

const pokemonAPICache = new InMemoryCache({
  typePolicies: {
    pokemon_v2_pokemon: {
      keyFields: getKeyFields,
    },
  },
});

const pokemonAPIClient = new ApolloClient({
  uri: "https://beta.pokeapi.co/graphql/v1beta/",
  cache: pokemonAPICache,
});

const backEndClient = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  credentials: "include",
  // request: (operation) => {
  //   const token = localStorage.getItem("token");
  //   operation.setContext({
  //     headers: {
  //       authorization: token ? `Bearer ${token}` : "",
  //     },
  //   });
  // },
  cache: new InMemoryCache(),
});

export { pokemonAPIClient, backEndClient };

import { ApolloClient, InMemoryCache } from "@apollo/client";

function getKeyFields(existing, { generationId }) {
  if (generationId) {
    return ["id", "generationId"];
  }
  if (existing.pokemon_v2_pokemonforms) {
    return ["id", "pokemon_v2_pokemonforms"]
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
  uri:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URI_PRODUCTION
      : process.env.REACT_APP_BACKEND_URI_DEVELOPMENT,
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

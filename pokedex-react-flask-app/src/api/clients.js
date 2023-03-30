import { ApolloClient, InMemoryCache } from "@apollo/client";

const pokemonAPIClient = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta/",
    cache: new InMemoryCache(),
  });
  
  const backEndClient = new ApolloClient({
    uri: "http://localhost:5000/graphql",
    cache: new InMemoryCache(),
  });
  

  export { pokemonAPIClient, backEndClient}
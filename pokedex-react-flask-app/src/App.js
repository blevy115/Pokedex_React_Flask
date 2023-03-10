import React from 'react';
import { useQuery, gql } from "@apollo/client"
import './App.css';

const GEN_1_QUERY = gql`
query { gen_1: pokemon_v2_pokemonspecies(
    where: {generation_id: {_eq: 1}},
    order_by: {id: asc}
  ) {
    id,
    name
  }
}`

export default function App() {
  const {data, loading, error} = useQuery(GEN_1_QUERY)
  if (loading) return "Loading..."
  if(error) return <pre>{error.message}</pre>

  const { gen_1 } = data
  return (
    <div className="App">
      <header className="App-header">
        <h2>Gen 1 Pokemon</h2>
        { gen_1 ? (
          <ul>
            {gen_1.map(({name, id}) => (<li key={id}>{name}</li>))}
          </ul>
        ) : undefined }
      </header>
    </div>
  );
}
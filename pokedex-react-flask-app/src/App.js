import React, {useState, useEffect} from 'react';
import { useQuery, gql } from "@apollo/client"
import './App.css';


function getPokemonGeneration(id) {
  return gql`
  query { pokemon_list: pokemon_v2_pokemonspecies(
      where: {generation_id: {_eq: ${id || 1}}},
      order_by: {id: asc}
    ) {
      id,
      name
    }
  }`
}

function getGenerationList() {
  return gql`
  query { generations: pokemon_v2_generation(distinct_on: id) {
    id
  }
  }`
}

export default function App() {
  const [generation, setGeneration] = useState()
  const {data: generations} = useQuery(getGenerationList())
  useEffect(() => {
    if (generations?.generations)  {
      setGeneration(generations[0])
    }
  }, [])

  const {data, loading, error} = useQuery(getPokemonGeneration(generation))
  if (loading) return "Loading..."
  if(error) return <pre>{error.message}</pre>

  const { pokemon_list } = data
  return (
    <div className="App">
      <header className="App-header">
        <h2>Gen {generation} Pokemon</h2>
        <select id="generation"
        onChange={(e) => setGeneration(e.target.value)}
          >
          Generation
        {generations?.generations.map(({id}) => (<option key={id} value={id}>{id}</option>))}
        </select>
        { pokemon_list ? (
          <ul>
            {pokemon_list.map(({name, id}) => (<li key={id}>{name}</li>))}
          </ul>
        ) : undefined }
      </header>
    </div>
  );
}
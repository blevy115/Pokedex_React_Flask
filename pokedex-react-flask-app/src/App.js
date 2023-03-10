import React from 'react';
import { useQuery, gql } from "@apollo/client"
import logo from './logo.svg';
import './App.css';

const GEN_1_QUERY = gql`
query { gen_1: pokemon_v2_pokemonspecies(where: {generation_id: {_eq: 1}}) {
    id,
    name
  }
}`

export default function App() {
  const {data, loading, error} = useQuery(GEN_1_QUERY)
  if (loading) return "Loading..."
  if(error) return <pre>{error.message}</pre>

  const { gen_1 } = data
  console.log(gen_1)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
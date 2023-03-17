import React, {useState} from 'react';
import { useQuery, gql } from "@apollo/client"
import PokemonList from '../components/PokemonList';

const GET_POKEMON_LIST = gql`
query GetPokemonList($name: String!){ 
  pokemon_list: pokemon_v2_pokemon(
    where: {name: {_ilike: $name}},
    order_by: {name: asc}
  ) {
    id,
    name,
  }
}`

export default function Main() {
    const [name, setName] = useState("")  
    const {data: list, loading: loadingList} = useQuery(GET_POKEMON_LIST, {
      variables: { name: `%${name}%` }
    })
  
    return (
      <div className="App">
        <header className="App-header">
           <p>Search For Pokemon</p>
          <input
            value={name}
            onChange={ (val) => setName(val.target.value)}
          ></input>
          { !loadingList && list ? <PokemonList 
            list={list.pokemon_list} 
          /> : <p>Loading</p>
          }
        </header>
      </div>
    );
  }
import React, {useEffect, useState} from 'react';
import { useQuery, gql } from "@apollo/client"
import PokemonList from '../components/PokemonList';
import GenerationSelector from '../components/GenerationSelector';

const GET_POKEMON_LIST = gql`
query GetPokemonList($generation: Int!){ 
  pokemon_list: pokemon_v2_pokemonspecies(
    where: {generation_id: {_eq: $generation}},
    order_by: {id: asc}
  ) {
    id,
    name,
  }
}`

const GET_GENERATION_LIST =   gql`
  query GetGenerationList { generations: pokemon_v2_generation(distinct_on: id) {
    id
  }
}`


export default function Main() {
    const [generation, setGeneration] = useState()
    const {data: generations, loading: loadingGenerations} = useQuery(GET_GENERATION_LIST)
  
    useEffect(() => {
      if (generations?.generations)  {
        setGeneration(generations.generations[0].id)
      }
    }, [generations])
  
    const {data: list, loading: loadingList} = useQuery(GET_POKEMON_LIST, {
      variables: { generation }
    })
  
    return (
      <div className="App">
        <header className="App-header">
          {!loadingGenerations && generations && (
            <GenerationSelector
            generations={generations.generations}
            generation={generation}
            setGeneration={setGeneration}
          />
          )}
          { !loadingList && list ? <PokemonList 
            list={list.pokemon_list} 
          /> : <p>Loading</p>
          }
        </header>
      </div>
    );
  }
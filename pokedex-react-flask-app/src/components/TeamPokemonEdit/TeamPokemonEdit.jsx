import React, {useState} from 'react'
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import {
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
} from "../../api/queries/pokeapi";

import {Loading, DebouncedInput} from "../../components";

import "./TeamPokemonEdit.scss"

const TeamPokemonEdit = ({teamPokemon, changeSelectedPokemon}) => {
    console.log(teamPokemon)
    const [textInput, setTextInput] = useState("");
    

  const { data: list, loading: loadingList } = useQuery(
    !parseInt(textInput) ? GET_POKEMON_LIST_BY_NAME : GET_POKEMON_LIST_BY_ID,
    {
      variables: !parseInt(textInput)
        ? { name: `%${textInput.replaceAll(" ", "-")}%` }
        : { id: parseInt(textInput) },
      skip: !textInput,
      client: pokemonAPIClient,
    }
  );

  const handlePokemonSelection = (selectedPokemon) => {
    changeSelectedPokemon(selectedPokemon);
  };
  

  return (<>
  <p>{teamPokemon.pokemon.name}</p>
  {loadingList && <Loading fullscreen={false} />}
  <div className="app__pokemon-search-field">
        <DebouncedInput
          id="app__pokemon-search-field"
          onValueChange={setTextInput}
          placeholder="Pokemon"
          debouceTime={400}
        />
        <div>
          {list &&
            list.pokemon_list.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => handlePokemonSelection(pokemon)}
                style={{ cursor: 'pointer' }}
              >
                {pokemon.name}
              </div>
            ))}
        </div>
      </div>
  </>

  )
}

export default TeamPokemonEdit
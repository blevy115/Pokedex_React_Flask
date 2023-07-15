import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import {
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
} from "../../api/queries/pokeapi";

import { PokemonList } from "../../components";

import "./PokemonSearch.scss";

const PokemonSearch = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    !parseInt(textInput) ? GET_POKEMON_LIST_BY_NAME : GET_POKEMON_LIST_BY_ID,
    {
      variables: !parseInt(textInput)
        ? { name: `%${textInput.replace(" ", "-")}%` }
        : { id: parseInt(textInput) },
      skip: !textInput,
      client: pokemonAPIClient,
    }
  );

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="app__pokemon-search">
      <h2 className="header-text">Welcome {user?.name}</h2>
      <div className="app__pokemon-search-field">
        <label htmlFor="app__pokemon-search-field">Search For Pokemon</label>
        <input
          id="app__pokemon-search-field"
          ref={inputRef}
          value={textInput}
          onChange={(val) => setTextInput(val.target.value)}
        />
      </div>

      {!loadingList && list ? (
        <PokemonList list={list.pokemon_list} />
      ) : undefined}
    </div>
  );
};

export default PokemonSearch;

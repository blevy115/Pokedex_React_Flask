import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
} from "../api/pokeapi";
import PokemonList from "../components/PokemonList";
import { pokemonAPIClient } from "../api/clients";
import NavBar from "../components/NavBar";

export default function PokemonSearch() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    !parseInt(textInput) ? GET_POKEMON_LIST_BY_NAME : GET_POKEMON_LIST_BY_ID,
    {
      variables: !parseInt(textInput)
        ? { name: `%${textInput}%` }
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
    <div className="App">
      <NavBar />
      <h2>Welcome {user?.name}</h2>

      <p>Search For Pokemon</p>
      <input
        ref={inputRef}
        value={textInput}
        onChange={(val) => setTextInput(val.target.value)}
      ></input>
      {!loadingList && list ? (
        <PokemonList list={list.pokemon_list} />
      ) : undefined}
    </div>
  );
}

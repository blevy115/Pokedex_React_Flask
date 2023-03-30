import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_LIST } from "../api/pokeapi";
import {GET_USERS_LIST, GET_SAVE_POKEMON} from "../api/backend"
import PokemonList from "../components/PokemonList";
import { pokemonAPIClient, backEndClient } from "../api/clients";

export default function Main() {
  const [name, setName] = useState("");
  const { data: list, loading: loadingList } = useQuery(GET_POKEMON_LIST, {
    variables: { name: `%${name}%` },
    skip: !name,
    client: pokemonAPIClient
  });

  const { data: userList, loading: loadingUserList } = useQuery(GET_USERS_LIST, {
    client: backEndClient,
    fetchPolicy: "cache-and-network",
  }, []);

  const { data: pokemonList, loading: loadingPokemonList } = useQuery(GET_SAVE_POKEMON, {
    client: backEndClient,
    fetchPolicy: "cache-and-network",
  }, []);


  useEffect(() => {
  console.log(userList, loadingUserList)

  }, [userList])


  useEffect(() => {
    console.log(pokemonList, loadingPokemonList)
  
    }, [pokemonList])

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>Search For Pokemon</p>
        <input
          ref={inputRef}
          value={name}
          onChange={(val) => setName(val.target.value)}
        ></input>
        {!loadingList && list ? (
          <PokemonList list={list.pokemon_list} />
        ) : undefined}
      </header>
    </div>
  );
}

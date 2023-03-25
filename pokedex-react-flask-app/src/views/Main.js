import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_LIST } from "../api/pokeapi";
import PokemonList from "../components/PokemonList";


export default function Main() {
  const [name, setName] = useState("");
  const { data: list, loading: loadingList } = useQuery(GET_POKEMON_LIST, {
    variables: { name: `%${name}%` },
    skip: !name,
  });

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

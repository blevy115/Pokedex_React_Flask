import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_LIST } from "../api/pokeapi";
import PokemonList from "../components/PokemonList";
import { pokemonAPIClient } from "../api/clients";
import NavBar from "../components/NavBar";

export default function Home() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [name, setName] = useState("");
  const { data: list, loading: loadingList } = useQuery(GET_POKEMON_LIST, {
    variables: { name: `%${name}%` },
    skip: !name,
    client: pokemonAPIClient,
  });

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
        value={name}
        onChange={(val) => setName(val.target.value)}
      ></input>
      {!loadingList && list ? (
        <PokemonList list={list.pokemon_list} />
      ) : undefined}
    </div>
  );
}

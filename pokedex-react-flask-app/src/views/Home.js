import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_LIST } from "../api/pokeapi";
import PokemonList from "../components/PokemonList";
import { pokemonAPIClient } from "../api/clients";
import { LOGOUT_MUTATION } from "../api/backend";
import { backEndClient } from "../api/clients";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

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

  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    client: backEndClient,
  });

  const handleLogout = async () => {
    await logoutMutation();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Welcome {user?.name}</h2>
        <button onClick={handleLogout}>Logout</button>
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

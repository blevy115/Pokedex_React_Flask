import React, { useEffect, useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { GET_USER_POKEMONS, SHINY_COUNTER_MUTATION } from "../api/backend";
import { backEndClient } from "../api/clients";

export default function FavouritedFeatures({
  pokemonId,
  userPokemonsData,
  pokedexes,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [shinyCounterInput, setShinyCounterInput] = useState("");
  const [selectedDex, setSelectedDex] = useState(
    pokedexes[0].pokemon_v2_pokedex.name
  );

  const [shinyCounterMutation] = useMutation(SHINY_COUNTER_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMONS,
        variables: { user_id: user.id },
      },
    ],
  });

  const shinyCounter = useMemo(() => {
    const userPokemon = userPokemonsData.userPokemons.find(
      (pokemon) => pokemon.pokemons.pokemonId == pokemonId
    );
    return userPokemon.shinyCounter;
  }, [userPokemonsData, pokemonId]);

  useEffect(() => {
    setShinyCounterInput("");
  }, [shinyCounter]);

  function handleIncreasingShinyCount(e) {
    e.preventDefault();
    shinyCounterMutation({
      variables: {
        user_id: user.id,
        pokemon_id: pokemonId,
        operation: "increment",
      },
    });
  }

  function handleDecreasingShinyCount(e) {
    e.preventDefault();
    shinyCounterMutation({
      variables: {
        user_id: user.id,
        pokemon_id: pokemonId,
        operation: "decrement",
      },
    });
  }

  function handleCustomShinyCount(e) {
    e.preventDefault();
    shinyCounterMutation({
      variables: {
        user_id: user.id,
        pokemon_id: pokemonId,
        operation: "set",
        value: shinyCounterInput,
      },
    });
  }

  return (
    <div>
      <h3>Regional Pokedexes</h3>
      <div id="regional-pokedex-selector">
        <select
          value={selectedDex}
          onChange={(e) => setSelectedDex(e.target.value)}
        >
          {pokedexes.map((pokedex, i) => (
            <option key={i} value={pokedex.pokemon_v2_pokedex.name}>
              {pokedex.pokemon_v2_pokedex.name}
            </option>
          ))}
        </select>
        <p>
          #
          {
            pokedexes.find(
              (pokedex) => pokedex.pokemon_v2_pokedex.name === selectedDex
            ).pokedex_number
          }
        </p>
      </div>
      <h2>Shiny Attempts: {shinyCounter}</h2>

      <form onSubmit={handleCustomShinyCount}>
        <label>
          Enter a Shiny Count:
          <input
            type="text"
            value={shinyCounterInput}
            onChange={(event) => setShinyCounterInput(event.target.value)}
          />
        </label>
        <button
          disabled={
            isNaN(shinyCounterInput) ||
            !Number.isInteger(parseFloat(shinyCounterInput)) ||
            parseInt(shinyCounterInput) < 0
          }
          type="submit"
        >
          Submit
        </button>
      </form>
      <button onClick={handleIncreasingShinyCount}>Increase</button>
      <button
        disabled={shinyCounter === 0}
        onClick={handleDecreasingShinyCount}
      >
        Decrease
      </button>
    </div>
  );
}

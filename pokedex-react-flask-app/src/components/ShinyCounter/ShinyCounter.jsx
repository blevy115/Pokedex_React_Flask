import React, { useEffect, useState, useMemo } from "react";
import { useMutation } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import {
  GET_USER_POKEMONS,
  SHINY_COUNTER_MUTATION,
} from "../../api/queries/backend";

import "./ShinyCounter.scss";

const ShinyCounter = ({ pokemonId, userPokemonsData }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [shinyCounterInput, setShinyCounterInput] = useState("");

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
};

export default ShinyCounter;

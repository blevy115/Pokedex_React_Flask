import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

import { backEndClient } from "../../api/clients";
import {
  GET_USER_POKEMON_SHINY_COUNT,
  SHINY_COUNTER_MUTATION,
} from "../../api/queries/backend";

import "./ShinyCounter.scss";

const ShinyCounter = ({ pokemonId }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [shinyCounterInput, setShinyCounterInput] = useState("");

  const { data, loading } = useQuery(GET_USER_POKEMON_SHINY_COUNT, {
    variables: { user_id: user.id, pokemon_id: pokemonId },
    client: backEndClient,
  });

  const [shinyCounterMutation] = useMutation(SHINY_COUNTER_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMON_SHINY_COUNT,
        variables: { user_id: user.id, pokemon_id: pokemonId },
      },
    ],
  });

  useEffect(() => {
    setShinyCounterInput("");
  }, [data]);

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

  if (loading) return;

  const { shinyCounter } = data.userPokemonShinyCount;

  return (
    <div className="app__shiny-counter">
      <div className="shiny-attempts-container">
        <h3>Shiny Attempts: {shinyCounter}</h3>
        <div className="shiny-attempts-buttons-container">
          <button onClick={handleIncreasingShinyCount}>
            <FaArrowUp />
          </button>
          <button
            disabled={shinyCounter === 0}
            onClick={handleDecreasingShinyCount}
          >
            <FaArrowDown />
          </button>
        </div>
      </div>
      <form className="shiny-counter-form" onSubmit={handleCustomShinyCount}>
        <label htmlFor="shiny-count">Custom Count:</label>

        <input
          id="shiny-count"
          className="shiny-count-input"
          type="text"
          value={shinyCounterInput}
          onChange={(event) => setShinyCounterInput(event.target.value)}
        />
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
    </div>
  );
};

export default ShinyCounter;

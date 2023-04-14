import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POKEMON_INFO } from "../api/pokeapi";
import {
  CHECK_POKEMON_EXISTS,
  GET_USER_POKEMONS,
  POKEMON_MUTATION,
  USER_POKEMON_MUTATION,
  SHINY_COUNTER_MUTATION,
} from "../api/backend";
import { pokemonAPIClient, backEndClient } from "../api/clients";

import TypeEffectiveness from "../components/TypeEffectiveness";
import PokemonImages from "../components/PokemonImages";
import StatChart from "../components/StatChart";
import Abilities from "../components/Abilities";
import NavBar from "../components/NavBar";
import MovesList from "../components/MovesList";

import { formatPokemonName } from "../helpers/format";
import { getSprite } from "../helpers/pictures";
import { handleImageError } from "../helpers/error";

export default function PokemonCard() {
  const params = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [shinyCounterInput, setShinyCounterInput] = useState("");
  const [selectedDex, setSelectedDex] = useState("");
  const { data, loading } = useQuery(GET_POKEMON_INFO, {
    variables: { id: parseInt(params.pokemonId) },
    client: pokemonAPIClient,
  });
  const { data: pokemonExistsData, loading: pokemonDataLoading } = useQuery(
    CHECK_POKEMON_EXISTS,
    {
      variables: { pokemon_id: parseInt(params.pokemonId) },
      client: backEndClient,
    }
  );
  const { data: userPokemonsData, loading: userPokemonsLoading } = useQuery(
    GET_USER_POKEMONS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
    }
  );

  const [createPokemon] = useMutation(POKEMON_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: CHECK_POKEMON_EXISTS,
        variables: { pokemon_id: parseInt(params.pokemonId) },
      },
    ],
  });

  const [mutateUserPokemonRelation] = useMutation(USER_POKEMON_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMONS,
        variables: { user_id: user.id },
      },
    ],
  });

  const [shinyCounterMutation] = useMutation(SHINY_COUNTER_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMONS,
        variables: { user_id: user.id },
      },
    ],
  });

  const name = !loading ? data.pokemon_details[0].name : undefined;

  const isAFavourite = useMemo(() => {
    return !userPokemonsLoading
      ? userPokemonsData.userPokemons.some(
          (pokemon) =>
            pokemon.pokemons.pokemonId == params.pokemonId && pokemon.isActive
        )
      : undefined;
  }, [userPokemonsData, userPokemonsLoading, params.pokemonId]);

  const shinyCounter = useMemo(() => {
    if (!isAFavourite) return undefined;
    const userPokemon = userPokemonsData.userPokemons.find(
      (pokemon) => pokemon.pokemons.pokemonId == params.pokemonId
    );
    return userPokemon.shinyCounter;
  }, [isAFavourite, userPokemonsData, params.pokemonId]);

  useEffect(() => {
    if (
      !loading &&
      name &&
      !pokemonDataLoading &&
      pokemonExistsData.pokemons.length === 0
    ) {
      createPokemon({
        variables: { pokemon_id: params.pokemonId, name: name },
      });
    }
  }, [name, params.pokemonId, loading, pokemonDataLoading, pokemonExistsData]);

  useEffect(() => {
    setShinyCounterInput("");
  }, [shinyCounter]);

  function handleUserPokemonLinking(e) {
    e.preventDefault();
    mutateUserPokemonRelation({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
        is_active: !isAFavourite,
      },
    });
  }

  function handleIncreasingShinyCount(e) {
    e.preventDefault();
    shinyCounterMutation({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
        operation: "increment",
      },
    });
  }

  function handleDecreasingShinyCount(e) {
    e.preventDefault();
    shinyCounterMutation({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
        operation: "decrement",
      },
    });
  }

  function handleCustomShinyCount(e) {
    e.preventDefault();
    shinyCounterMutation({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
        operation: "set",
        value: shinyCounterInput,
      },
    });
  }

  if (loading) return <p>Loading...</p>;
  const { types, info, stats, abilities, form } = data.pokemon_details[0];
  return (
    <div>
      <NavBar />
      <div style={{ margin: "auto", width: "60%" }}>
        <div id="pokemon-headers-container">
          <div className={parseInt(params.pokemonId) <= 1 ? "hide" : ""}>
            <Link to={`/pokemon/${parseInt(params.pokemonId) - 1}`}>
              Previous
            </Link>
            <img
              onError={handleImageError}
              src={getSprite(parseInt(params.pokemonId) - 1)}
            />
          </div>
          <p id="pokemon-title">
            {formatPokemonName(name)} #{params.pokemonId}
          </p>
          <div>
            <Link to={`/pokemon/${parseInt(params.pokemonId) + 1}`}>Next</Link>
            <img
              onError={handleImageError}
              src={getSprite(parseInt(params.pokemonId) + 1)}
            />
          </div>
        </div>
        <button id="favourite-button" onClick={handleUserPokemonLinking}>
          {isAFavourite ? "Unfavourite" : "Favourite"}
        </button>
        <PokemonImages id={params.pokemonId} />
        <ul className="type-list">
          {types.map((type) => {
            return (
              <li key={type.pokemon_v2_type.id}>
                <img
                  src={`/icons/types/${type.pokemon_v2_type.name}.png`}
                  alt={`${type.pokemon_v2_type.name} icon`}
                />
              </li>
            );
          })}
        </ul>
        <div>
          <p>Generation: {form[0].pokemon_v2_versiongroup.generation_id}</p>
          {isAFavourite && (
            <div>
              <h3>Regional Pokedexes</h3>
              <select
                value={selectedDex}
                onChange={(e) => setSelectedDex(e.target.value)}
              >
                <option value="">Select a Pokedex</option>
                {info.pokedexes.map((pokedex, i) => (
                  <option key={i} value={pokedex.pokemon_v2_pokedex.name}>
                    {pokedex.pokemon_v2_pokedex.name}
                  </option>
                ))}
              </select>
              <p>
                Selected option:{" "}
                {selectedDex
                  ? info.pokedexes.find(
                      (pokedex) =>
                        pokedex.pokemon_v2_pokedex.name === selectedDex
                    )?.pokedex_number
                  : undefined}
              </p>
              {/* {info.pokedex.map((pokedex, i) => {
                return (
                  <p key={i}>
                    {pokedex.pokemon_v2_pokedex.name}: #{pokedex.pokedex_number} 
                  </p>
                )
              })} */}
              <h2>Shiny Attempts: {shinyCounter}</h2>

              <form onSubmit={handleCustomShinyCount}>
                <label>
                  Enter a Shiny Count:
                  <input
                    type="text"
                    value={shinyCounterInput}
                    onChange={(event) =>
                      setShinyCounterInput(event.target.value)
                    }
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
          )}
          {info.has_gender_differences ? (
            <p>Has Gender Differences</p>
          ) : undefined}
          <p>Types</p>
          <TypeEffectiveness
            types={types.map((type) => type.pokemon_v2_type.name)}
          />
          <p>Stats</p>
          <StatChart baseStats={stats} isAFavourite={isAFavourite} />
          <p>Abilities</p>
          <Abilities abilities={abilities} />
        </div>
        <MovesList
          id={parseInt(params.pokemonId)}
          generation={form[0].pokemon_v2_versiongroup.generation_id}
        />
      </div>
    </div>
  );
}

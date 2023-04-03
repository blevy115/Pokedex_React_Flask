import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POKEMON_INFO } from "../api/pokeapi";
import {
  CHECK_POKEMON_EXISTS,
  GET_USER_POKEMONS,
  POKEMON_MUTATION,
  USER_POKEMON_MUTATION,
  INCREASE_SHINY_COUNT,
} from "../api/backend";

import TypeEffectiveness from "../components/TypeEffectiveness";
import PokemonImages from "../components/PokemonImages";
import MovesList from "../components/MovesList";
import { pokemonAPIClient, backEndClient } from "../api/clients";
import NavBar from "../components/NavBar";

export default function PokemonCard() {
  const params = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
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

  const [linkUserToPokemon] = useMutation(USER_POKEMON_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMONS,
        variables: { user_id: user.id },
      },
    ],
  });

  const [increaseShinyCount] = useMutation(INCREASE_SHINY_COUNT, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMONS,
        variables: { user_id: user.id },
      },
    ],
  });

  const name = !loading ? data.pokemon_details[0].name : undefined;

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

  function handleFavouritingPokemon(e) {
    e.preventDefault();
    linkUserToPokemon({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
      },
    });
  }

  function handleIncreasingShinyCount(e) {
    e.preventDefault();
    increaseShinyCount({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
      },
    });
  }

  const isAFavourite = useMemo(() => {
    return !userPokemonsLoading
      ? userPokemonsData.userPokemons.some(
          (pokemon) => pokemon.pokemons.pokemonId == params.pokemonId
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

  if (loading) return <p>Loading...</p>;
  const { types, info, stats, abilities, level_moves, egg_moves, tm_moves } =
    data.pokemon_details[0];

  return (
    <div>
      <NavBar />
      <div style={{ margin: "auto", width: "60%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Link to={`/pokemon/${parseInt(params.pokemonId) - 1}`}>
            Previous
          </Link>
          <p style={{ textAlign: "center" }}>{name}</p>
          <Link to={`/pokemon/${parseInt(params.pokemonId) + 1}`}>Next</Link>
        </div>
        <PokemonImages id={params.pokemonId} />
        <button onClick={handleFavouritingPokemon} disabled={isAFavourite}>
          Favourite
        </button>
        <div>
          <p>Generation: {info.generation_id}</p>
          {isAFavourite && (
            <div>
              <h2>Shiny Attempts: {shinyCounter}</h2>
              <button onClick={handleIncreasingShinyCount}>Increase</button>
            </div>
          )}
          {info.has_gender_differences ? (
            <p>Has Gender Differences</p>
          ) : undefined}
          <p>Types</p>
          <ul style={{ listStyleType: "none" }}>
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
          <TypeEffectiveness
            types={types.map((type) => type.pokemon_v2_type.name)}
          />
          <p>Stats</p>
          <ul>
            {stats.map((stat) => {
              return (
                <li key={stat.pokemon_v2_stat.id}>
                  {stat.pokemon_v2_stat.name}: {stat.base_stat}{" "}
                  <b>{stat.effort ? `${stat.effort} EV` : undefined}</b>
                </li>
              );
            })}
          </ul>
          <p>Abilities</p>
          <ol>
            {abilities.map((ability) => {
              const hasAbilityText = ability.pokemon_v2_ability.text.length > 0;
              return (
                <div key={ability.pokemon_v2_ability.id}>
                  <li>
                    {ability.pokemon_v2_ability.name}
                    {ability.is_hidden && " (Hidden)"}
                    <span className="HoverToSee">
                      {hasAbilityText
                        ? ability.pokemon_v2_ability.text[0].short_effect
                        : undefined}
                    </span>
                  </li>
                </div>
              );
            })}
          </ol>
        </div>
        <MovesList
          levelMoves={level_moves.slice().sort((a, b) => a.level - b.level)}
          eggMoves={egg_moves}
          tmMoves={tm_moves}
        />
      </div>
    </div>
  );
}

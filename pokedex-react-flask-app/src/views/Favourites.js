import React from "react";
import { useQuery } from "@apollo/client";
import { backEndClient } from "../api/clients";
import { GET_USER_POKEMONS } from "../api/backend";
import { useNavigate } from "react-router-dom";

export default function Favourites() {
  const user = JSON.parse(localStorage.getItem("user"));
  let navigate = useNavigate();

  const { data: userPokemonsData, loading: userPokemonsLoading } = useQuery(
    GET_USER_POKEMONS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
    }
  );

  if (userPokemonsLoading) return <p>Loading...</p>;

  if (userPokemonsData.userPokemons.length === 0)
    return <p>Please add some favourites</p>;

  return (
    <>
      <ul>
        {userPokemonsData.userPokemons.map((pokemon, i) => {
          return (
            <li
              key={i}
              onClick={() => navigate(`/pokemon/${pokemon.pokemons.pokemonId}`)}
            >
              {pokemon.pokemons.name} <br /> Shiny Attempts:{" "}
              {pokemon.shinyCounter}
            </li>
          );
        })}
      </ul>
    </>
  );
}

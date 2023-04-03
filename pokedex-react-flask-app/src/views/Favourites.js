import React from "react";
import NavBar from "../components/NavBar";
import { useQuery } from "@apollo/client";
import { backEndClient } from "../api/clients";
import { GET_USER_POKEMONS } from "../api/backend";
import { useNavigate } from "react-router-dom";
import { formatPokemonName } from "../helpers/format";

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

  return (
    <div className="App">
      <NavBar />
      {userPokemonsData.userPokemons.length === 0 ? (
        <p>Please add some favourites</p>
      ) : (
        <ul>
          {userPokemonsData.userPokemons.map((pokemon, i) => {
            return (
              <li
                key={i}
                onClick={() =>
                  navigate(`/pokemon/${pokemon.pokemons.pokemonId}`)
                }
              >
                {formatPokemonName(pokemon.pokemons.name)} #{pokemon.pokemons.pokemonId}<br /> Shiny Attempts:{" "}
                {pokemon.shinyCounter}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

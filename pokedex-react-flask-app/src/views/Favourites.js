import React from "react";
import NavBar from "../components/NavBar";
import { useQuery } from "@apollo/client";
import { backEndClient } from "../api/clients";
import { GET_USER_POKEMONS } from "../api/backend";
import { useNavigate } from "react-router-dom";
import { formatPokemonName } from "../helpers/format";
import { handleImageError } from "../helpers/error";

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
        <div className="favourites-list">
          {userPokemonsData.userPokemons.map((pokemon, i) => {
            return (
              <div
                className="favourites-list-item"
                key={i}
                onClick={() =>
                  navigate(`/pokemon/${pokemon.pokemons.pokemonId}`)
                }
              >
                <p>
                  {formatPokemonName(pokemon.pokemons.name)} #
                  {pokemon.pokemons.pokemonId}
                </p>
                <img
                  className="favourite-image"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.pokemons.pokemonId}.gif`}
                  onError={handleImageError}
                />
                <p>
                {pokemon.shinyCounter !== 0 && (
                   <>Shiny Attempts: {pokemon.shinyCounter}</>
                )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

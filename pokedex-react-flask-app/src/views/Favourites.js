import React from "react";
import NavBar from "../components/NavBar";
import { useQuery } from "@apollo/client";
import { backEndClient } from "../api/clients";
import { GET_USER_POKEMONS } from "../api/backend";
import { useNavigate } from "react-router-dom";
import { formatPokemonName } from "../helpers/format";
import { handleImageError } from "../helpers/error";
import { getAnimatedSprite } from "../helpers/pictures";

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
  const activeFavourites = userPokemonsData.userPokemons.filter(
    (pokemon) => pokemon.isActive
  );

  return (
    <div className="App">
      <NavBar />
      {activeFavourites.length === 0 ? (
        <p>Please add some favourites</p>
      ) : (
        <div className="favourites-list">
          {activeFavourites.map((pokemon, i) => {
            const { name, pokemonId } = pokemon.pokemons;
            return (
              <div
                className="favourites-list-item"
                key={i}
                onClick={() => navigate(`/pokemon/${pokemonId}`)}
              >
                <p>
                  {formatPokemonName(name)} #{pokemonId}
                </p>
                <img
                  className="favourite-image"
                  src={getAnimatedSprite(pokemonId)}
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

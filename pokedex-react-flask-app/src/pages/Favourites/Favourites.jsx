import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import { GET_USER_POKEMONS } from "../../api/queries/backend";

import { formatName } from "../../helpers/format";
import { handleSpriteError } from "../../helpers/error";
import { getSprite } from "../../helpers/pictures";

import { Loading } from "../../components";

import "./Favourites.scss";

const Favourites = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  let navigate = useNavigate();

  const { data: userPokemonsData, loading: userPokemonsLoading } = useQuery(
    GET_USER_POKEMONS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
    }
  );

  if (userPokemonsLoading) return <Loading />;
  const activeFavourites = userPokemonsData.userPokemons.filter(
    (pokemon) => pokemon.isActive
  );

  return (
    <div className="app__favourites">
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
                <p className="favourites-list-item-header">
                  #{pokemonId} {formatName(name)}
                </p>
                <img
                  className="favourite-image"
                  src={getSprite(pokemonId)}
                  onError={handleSpriteError}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favourites;

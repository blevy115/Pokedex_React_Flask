import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPokemonName } from "../helpers/format";
import { handleImageError } from "../helpers/error";

export default function PokemonList({ list }) {
  let navigate = useNavigate();
  return (
    <ul className="pokemon-list">
      {list.map(({ name, id }) => (
        <li
          className="pokemon-list-item"
          key={id}
          onClick={() => navigate(`/pokemon/${id}`)}
        >
          <p>
            {formatPokemonName(name)} #{id}
          </p>
          <img
            onError={handleImageError}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          />
        </li>
      ))}
    </ul>
  );
}

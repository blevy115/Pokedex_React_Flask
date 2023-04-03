import React from "react";
import { useNavigate } from "react-router-dom";

export default function PokemonList({ list }) {
  let navigate = useNavigate();
  return (
    <ul className="pokemon-list">
      {list.map(({ name, id }) => (
        <li className="pokemon-list-item" key={id} onClick={() => navigate(`/pokemon/${id}`)}>
          {name}
        </li>
      ))}
    </ul>
  );
}

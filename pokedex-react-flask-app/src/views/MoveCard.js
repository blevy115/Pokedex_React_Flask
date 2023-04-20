import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import NavBar from "../components/NavBar";
import { GET_MOVE_INFO } from "../api/pokeapi";
import { pokemonAPIClient } from "../api/clients";
import PokemonsTable from "../components/PokemonsTable";

export default function MoveCard() {
  const params = useParams();

  const { data, loading } = useQuery(GET_MOVE_INFO, {
    variables: { id: parseInt(params.moveId) },
    client: pokemonAPIClient,
  });

  if (loading) return <p>Loading...</p>;

  const { name, type, kind, generation_id, pp, accuracy, power, flavor } =
    data.move[0];

  return (
    <div>
      <NavBar />
      <div id="move-info">
        <p>{name}</p>
        <p>{flavor[0] && flavor[0].text}</p>
        <p>
          Type:{" "}
          <img
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
          />
        </p>
        <p>
          Kind:{" "}
          <img
            src={`/icons/kinds/${kind.name}.png`}
            alt={`${kind.name} icon`}
          />
        </p>
        <p>Power: {power}</p>
        <p>Accuracy: {accuracy}</p>
        <p>PP: {pp}</p>
      </div>
      <PokemonsTable id={parseInt(params.moveId)} generation={generation_id} />
    </div>
  );
}

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { pokemonAPIClient, backEndClient } from "../../api/clients";
import { GET_MOVE_INFO } from "../../api/queries/pokeapi";
import { MOVE_MUTATION } from "../../api/queries/backend";

import { formatPokemonName } from "../../helpers/format";

import { PokemonsTable } from "../../components";

import "./MoveDetail.scss";

const MoveDetail = () => {
  const params = useParams();

  const { data, loading } = useQuery(GET_MOVE_INFO, {
    variables: { id: parseInt(params.moveId) },
    client: pokemonAPIClient,
  });

  const [createOrGetMove] = useMutation(MOVE_MUTATION, {
    client: backEndClient,
  });

  const name = !loading ? data.move[0].name : undefined;

  useEffect(() => {
    if (!loading && name) {
      createOrGetMove({
        variables: { move_id: params.moveId, name: name },
      });
    }
  }, [name, params.moveId, loading]);

  if (loading) return <p>Loading...</p>;

  const { type, kind, generation_id, pp, accuracy, power, flavor, tm } =
    data.move[0];

  return (
    <div className="app__move">
      <div className="app__move-info">
        <h3>{formatPokemonName(name)}</h3>
        <p>{flavor[0] && flavor[0].text}</p>
        <p className="move-kind">
          <span>Type:</span>
          <img
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
          />
        </p>
        <p className="move-kind">
          <span> Kind:</span>
          <img
            src={`/icons/kinds/${kind.name}.png`}
            alt={`${kind.name} icon`}
          />
        </p>
        <p>Power: {power}</p>
        <p>Accuracy: {accuracy}</p>
        <p>PP: {pp}</p>
      </div>
      <PokemonsTable
        id={parseInt(params.moveId)}
        generation={generation_id}
        tm={tm}
      />
    </div>
  );
};

export default MoveDetail;

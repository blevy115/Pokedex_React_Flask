import React from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { GET_G_MAX_MOVES_LIST } from "../../api/queries/pokeapi";
import { pokemonAPIClient } from "../../api/clients";

import { formatName } from "../../helpers/format";
import { getSprite } from "../../helpers/pictures";
import { handleSpriteError } from "../../helpers/error";

import { Loading, GMaxMoveTable } from "../";

import "./GMaxMoveDetail.scss";

const GMaxMoveDetail = ({ move }) => {
  const navigate = useNavigate();
  const { name, effect, pokemon, species_id, type, power } = move;

  const { data, loading } = useQuery(GET_G_MAX_MOVES_LIST, {
    variables: { typeId: type.id, speciesId: species_id },
    client: pokemonAPIClient,
  });

  return (
    <>
      <div className="app__move-info">
        <h1>{formatName(name)}</h1>
        <p>Description: {effect}</p>
        {pokemon.map(({ id, name }) => (
          <div key={id} style={{ display: "flex", flexDirection: "column" }}>
            <img
              className="pokemon-list-item-sprite clickable"
              onError={handleSpriteError}
              src={getSprite(id)}
              onClick={() => navigate(`/pokemon/${id}`)}
            />
            <p>{formatName(name)}</p>
          </div>
        ))}
        <p className="move-kind">
          <span>Type:</span>
          <img
            className="clickable"
            src={`/icons/types/${type.name}.png`}
            alt={`${type.name} icon`}
            onClick={() => navigate(`/types/${type.id}`)}
          />
        </p>
        <div style={{ marginBottom: "1em" }} className="move-kind">
          <span> Kind:</span>
          <div className="z-move-types-container">
            <img src="/icons/kinds/physical.png" alt="physical icon" />
            <img src="/icons/kinds/special.png" alt="special icon" />
          </div>
        </div>
        {power && <p>{power}</p>}
        <p>Category: G-Max Move</p>
      </div>
      <div className="gmax-moves-table-container">
        {!loading ? (
          <GMaxMoveTable data={data} type={type} />
        ) : (
          <Loading fullscreen={false} />
        )}
      </div>
    </>
  );
};

export default GMaxMoveDetail;

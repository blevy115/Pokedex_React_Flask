import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_TYPE_INFO } from "../../api/queries/pokeapi";
import { pokemonAPIClient } from "../../api/clients";

import { formatName } from "../../helpers/format";

import {
  Loading,
  TypeMoves,
  TypePokemon,
  TypeRelations,
} from "../../components";

const tabs = ["Pokemon", "Moves"];

import "./TypeDetail.scss";

const TypeDetail = () => {
  const params = useParams();
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const { data, loading } = useQuery(GET_TYPE_INFO, {
    variables: { id: parseInt(params.typeId) },
    client: pokemonAPIClient,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  if (loading) return <Loading />;
  const { name, moves, pokemons, id } = data.pokemon_v2_type[0];
  return (
    <div className="app_type-details">
      <div className="app__type-details-info">
        <h1>{formatName(name)} Type</h1>
        <TypeRelations type={name} />
        <div className="app__type-details-tabs-container">
          <ul className="app__type-details-tabs">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`app__type-details-tabs-item ${
                  selectedTab === tab ? "active" : ""
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="app__type-table-container">
        {selectedTab === "Pokemon" && (
          <TypePokemon name={name} list={pokemons} typeId={id} />
        )}
        {selectedTab === "Moves" && <TypeMoves list={moves} />}
      </div>
    </div>
  );
};

export default TypeDetail;

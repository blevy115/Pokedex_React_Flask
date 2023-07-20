import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_TYPE_INFO } from "../../api/queries/pokeapi";
import { pokemonAPIClient } from "../../api/clients";

import { TypeMoves, TypePokemon } from "../../components";

const tabs = ["Pokemon", "Moves"];

import "./TypeDetail.scss";

const TypeDetail = () => {
  const params = useParams();
  const [byType, setbyType] = useState();
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const { data, loading } = useQuery(GET_TYPE_INFO, {
    variables: { id: parseInt(params.typeId) },
    client: pokemonAPIClient,
  });
  useEffect(() => {
    setbyType(false);
    window.scrollTo(0, 0);
  }, [data]);

  if (loading) return <>Loading...</>;
  const { name, moves, pokemons, id } = data.pokemon_v2_type[0];

  return (
    <>
      <div className="app__type-details-info">
        <h3>{name}</h3>
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
          <>
            <button
              onClick={() => {
                setbyType(!byType);
              }}
            >
              Sort by {byType ? "ID" : "Type"}
            </button>
            <TypePokemon
              name={name}
              list={pokemons}
              typeId={id}
              byType={byType}
            />
          </>
        )}
        {selectedTab === "Moves" && <TypeMoves list={moves} />}
      </div>
    </>
  );
};

export default TypeDetail;

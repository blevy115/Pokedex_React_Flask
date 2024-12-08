import React, { useEffect, useState, useMemo } from "react";
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
  const [generationId, setGenerationId] = useState(null);
  const [selectedGenerationId, setSelectedGenerationId] = useState(null);
  const [showOnlySelectedGenResults, setShowOnlySelectedGenResults] =
    useState(false);

  const { data, loading } = useQuery(GET_TYPE_INFO, {
    variables: { id: parseInt(params.typeId) },
    client: pokemonAPIClient,
    onCompleted: (data) => {
      setGenerationId(data.pokemon_v2_type[0].generation_id);
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedGenerationId("All");
    setShowOnlySelectedGenResults(false);
  }, [data]);

  const generationOptions = useMemo(() => {
    if (!generationId) return [];
    const options = [
      <option key="all" value="All">
        All
      </option>,
    ];
    for (let i = generationId; i <= 9; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  }, [generationId, data]);

  if (loading) return <Loading />;
  const { name, moves, pokemons, id } = data.pokemon_v2_type[0];

  return (
    <div className={`app__type-details ${name}-color-2`}>
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
        <div className="select-input">
          <label htmlFor="GenerationSelector">Generation:</label>
          <select
            id="GenerationSelector"
            value={selectedGenerationId || "All"}
            onChange={(e) =>
              setSelectedGenerationId(
                e.target.value === "All" ? "All" : parseInt(e.target.value)
              )
            }
          >
            {generationOptions}
          </select>
        </div>
        {selectedGenerationId && selectedGenerationId !== "All" ? (
          <div className="checkbox-input">
            <label htmlFor="ShowOnlySelectedGenResults">
              Only Generation {selectedGenerationId}
              <input
                id="ShowOnlySelectedGenResults"
                type="checkbox"
                className="clickable"
                checked={showOnlySelectedGenResults}
                onChange={(e) =>
                  setShowOnlySelectedGenResults(e.target.checked)
                }
              />
            </label>
          </div>
        ) : null}
        {selectedTab === "Pokemon" && (
          <TypePokemon
            name={name}
            list={pokemons}
            typeId={id}
            generationId={selectedGenerationId}
            onlySelectedGen={showOnlySelectedGenResults}
          />
        )}
        {selectedTab === "Moves" && (
          <TypeMoves
            list={moves}
            generationId={selectedGenerationId}
            onlySelectedGen={showOnlySelectedGenResults}
          />
        )}
      </div>
    </div>
  );
};

export default TypeDetail;

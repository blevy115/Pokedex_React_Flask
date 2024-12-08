import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_EGG_GROUP_INFO } from "../../api/queries/pokeapi";
import { pokemonAPIClient } from "../../api/clients";

import { formatName } from "../../helpers/format";
import { eggGroupNameHelper } from "../../helpers/eggGroupNamehelper";

import { Loading, EggGroupPokemon } from "../../components";

import "./EggGroupDetail.scss";

const EggGroupDetail = () => {
  const params = useParams();
  const [selectedGenerationId, setSelectedGenerationId] = useState(null);
  const [showOnlySelectedGenResults, setShowOnlySelectedGenResults] =
    useState(false);

  const { data, loading } = useQuery(GET_EGG_GROUP_INFO, {
    variables: { id: parseInt(params.eggGroupId) },
    client: pokemonAPIClient,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedGenerationId("All");
    setShowOnlySelectedGenResults(false);
  }, [data]);

  const generationOptions = useMemo(() => {
    const options = [
      <option key="all" value="All">
        All
      </option>,
    ];
    for (let i = 1; i <= 9; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  }, [data]);

  if (loading) return <Loading />;
  const { name, pokemons, id } = data.pokemon_v2_egggroup[0];
  const eggGroupName = eggGroupNameHelper(name);
  return (
    <div className={`app__egg-group-details`}>
      <div className="app__egg-group-details-info">
        <h1>{formatName(eggGroupName)} Egg Group</h1>
      </div>
      <div className="app__egg-group-table-container">
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
        <EggGroupPokemon
          name={eggGroupName}
          list={pokemons}
          eggGroupId={id}
          generationId={selectedGenerationId}
          onlySelectedGen={showOnlySelectedGenResults}
        />
      </div>
    </div>
  );
};

export default EggGroupDetail;

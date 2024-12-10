import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../../api/clients";
import { GET_ABILITY_POKEMONS } from "../../../api/queries/pokeapi";

import { modifyPokemon } from "../../../helpers/modifyForTable";

import { Loading, Table } from "../..";
import {
  SpriteComponent,
  PokemonNameComponent,
  TypesImageComponent,
  AbilitiesComponent,
} from "../../TableCellComponents/TableCellComponents";

import "./AbilityPokemonsTable.scss";

const AbilityPokemonsTable = ({ id }) => {
  const [generationId, setGenerationId] = useState(null);
  const [selectedGenerationId, setSelectedGenerationId] = useState("All");
  const [showOnlySelectedGenResults, setShowOnlySelectedGenResults] =
    useState(false);

  const [tableExtended, setTableExtended] = useState(false);

  const { data, loading } = useQuery(GET_ABILITY_POKEMONS, {
    variables: { id },
    client: pokemonAPIClient,
    onCompleted: (data) => {
      setGenerationId(data.ability[0].generation_id);
    },
  });

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

  const filteredPokemon = useMemo(() => {
    if (!data) return [];
    const list = data.ability[0].pokemons;
    if (selectedGenerationId === "All") return list;
    return list.filter((pokemon) => {
      const gen =
        pokemon.pokemon_v2_pokemon.pokemon_v2_pokemonforms[0]
          .pokemon_v2_versiongroup.generation_id;
      const isWithinGen = gen <= selectedGenerationId;
      const isExactGen = gen === selectedGenerationId;
      return showOnlySelectedGenResults ? isExactGen : isWithinGen;
    });
  }, [data, selectedGenerationId, showOnlySelectedGenResults]);

  if (loading) return <Loading fullscreen={false} />;

  const { id: pageId } = data.ability[0];
  const { tableData, columns } = modifyPokemon({
    pokemons: filteredPokemon,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    TypesImageComponent,
    AbilitiesComponent,
    hasAbilities: true,
    hasGeneration: !showOnlySelectedGenResults,
    hasStats: tableExtended,
    pageId,
  });

  return (
    <div className="app__ability-pokemon-table">
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
              onChange={(e) => setShowOnlySelectedGenResults(e.target.checked)}
            />
          </label>
        </div>
      ) : null}
      <div className="checkbox-input">
        <label htmlFor="ExtendTable">
          Show Stats
          <input
            id="ExtendTable"
            type="checkbox"
            className="clickable"
            checked={tableExtended}
            onChange={(e) => setTableExtended(e.target.checked)}
          />
        </label>
      </div>
      {filteredPokemon.length > 0 ? (
        <div>
          <Table data={tableData} columns={columns} />
        </div>
      ) : (
        <p>No Pokemons Found</p>
      )}
    </div>
  );
};

export default AbilityPokemonsTable;

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../../api/clients";
import { GET_MOVE_POKEMONS } from "../../../api/queries/pokeapi";

import {
  mergePokemonEntries,
  mergeTmEntries,
} from "../../../helpers/mergeEntries";
import { formatGameName } from "../../../helpers/format";

import { modifyPokemon } from "../../../helpers/modifyForTable";
import { doesMoveHaveUniqueZMoves } from "../../../helpers/zMoveHelper";

import { MoveZMoveTable, Table, Loading } from "../..";
import {
  SpriteComponent,
  PokemonNameComponent,
  TypesImageComponent,
  LevelComponent,
} from "../../TableCellComponents/TableCellComponents";

import "./MovePokemonsTable.scss";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
};

const defaultMoveLearnMethod = "level";

const tabs = {
  0: "Pokemon",
};

const MovePokemonsTable = ({ id, generation, tm }) => {
  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [tableExtended, setTableExtended] = useState(false);

  const tmByGeneration = useMemo(() => {
    return mergeTmEntries(tm);
  }, [id]);

  const uniqueZMoves = useMemo(() => {
    return generationId === 7 ? doesMoveHaveUniqueZMoves(id) : null;
  });

  useEffect(() => {
    if (tmByGeneration[generationId]) {
      moveTypes["tm"] = 4;
    } else {
      delete moveTypes["tm"];
    }
    if (uniqueZMoves) {
      tabs[1] = "Z-Moves";
    } else {
      delete tabs[1];
      setSelectedTab(tabs[0]);
    }
    setMoveType("level");
  }, [generationId]);

  useEffect(() => {
    setGenerationId(generation);
    setMoveType(defaultMoveLearnMethod);
  }, [id]);

  const { data, loading } = useQuery(GET_MOVE_POKEMONS, {
    variables: { id, generationId, moveLearnMethodId: moveTypes[moveType] },
    client: pokemonAPIClient,
  });

  const generationOptions = useMemo(() => {
    const options = [];
    for (let i = generation; i <= 9; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  }, [generation]);

  if (loading) return <Loading fullscreen={false} />;

  const { pokemons } = data.move[0];

  const { tableData, columns } = modifyPokemon({
    pokemons: mergePokemonEntries(pokemons),
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    TypesImageComponent,
    LevelComponent,
    hasLevelData: moveType === "level",
    hasStats: tableExtended
  });

  return (
    <div className="app__move-pokemon-table">
      {tmByGeneration[generationId] && (
        <ul className="game-tm-list">
          {tmByGeneration[generationId].map((gameTm, i) => (
            <li key={i} className="game-tm-item">
              {formatGameName(gameTm.game)}:{" "}
              <span className="game-tm-item-number">{gameTm.machine}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="select-input">
        <label htmlFor="MoveGenerationSelector">Generation:</label>
        <select
          id="MoveGenerationSelector"
          value={generationId}
          onChange={(e) => setGenerationId(parseInt(e.target.value))}
        >
          {generationOptions}
        </select>
      </div>
      <div className="select-input">
        <label htmlFor="MoveTypeSelector">Move Type:</label>
        <select
          id="MoveTypeSelector"
          value={moveType}
          onChange={(e) => setMoveType(e.target.value)}
        >
          {Object.keys(moveTypes).map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      {uniqueZMoves?.length >= 1 && (
        <>
          <div className="app__move-pokemons-table-tabs-container">
            <ul className="app__move-pokemons-table-tabs">
              {Object.keys(tabs).map((key) => (
                <li
                  key={tabs[key]}
                  className={`app__move-pokemons-table-tabs-item ${
                    selectedTab === tabs[key] ? "active" : ""
                  }`}
                  onClick={() => setSelectedTab(tabs[key])}
                >
                  {tabs[key]}
                </li>
              ))}
            </ul>
          </div>
          {selectedTab === "Z-Moves" && <MoveZMoveTable moves={uniqueZMoves} />}
        </>
      )}
      {pokemons.length > 0 && selectedTab === "Pokemon" ? (
        <>
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
          <div className="pokemons-table">
            <Table data={tableData} columns={columns} />
          </div>
        </>
      ) : (
        selectedTab === "Pokemon" && <p>No Pokemons Found</p>
      )}
    </div>
  );
};

export default MovePokemonsTable;

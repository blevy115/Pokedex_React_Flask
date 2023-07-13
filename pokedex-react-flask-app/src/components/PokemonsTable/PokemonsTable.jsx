import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_MOVE_POKEMONS } from "../../api/queries/pokeapi";

import {
  mergePokemonEntries,
  mergeTmEntries,
} from "../../helpers/mergeEntries";
import { formatPokemonName } from "../../helpers/format";

import { handleImageError } from "../../helpers/error";
import { getSprite } from "../../helpers/pictures";

import { Table } from "../";

import { modifyPokemon } from "../../helpers/modifyForTable";

import { TypeList } from "../";

import "./PokemonsTable.scss";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
  tm: 4,
};

const defaultMoveLearnMethod = "level";

const PokemonsTable = ({ id, generation, tm }) => {
  let navigate = useNavigate();

  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);

  const tmByGeneration = useMemo(() => {
    return mergeTmEntries(tm);
  }, [id]);

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

  if (loading) return <p>Loading...</p>;

  const { pokemons } = data.move[0];

  const SpriteComponent = ({ value }) => {
    return (
      <img
        className="pokemon-list-item-sprite"
        onError={handleImageError}
        src={getSprite(value)}
        onClick={() => navigate(`/pokemon/${value}`)}
      />
    );
  };

  const TypesImageComponent = ({ value }) => {
    return <TypeList types={value} />;
  };

  const LevelComponent = ({ value }) => {
    return (
      <div>
        {value.map((val, i) => (
          <p key={i}>
            {formatPokemonName(val.pokemon_v2_versiongroup.name)} Level:{" "}
            {val.level}
          </p>
        ))}
      </div>
    );
  };

  const { tableData, columns } = modifyPokemon({
    pokemons: mergePokemonEntries(pokemons),
    SpriteComponent,
    TypesImageComponent,
    LevelComponent,
    hasLevelData: moveType === "level",
  });

  return (
    <div className="app__move-pokemon-table">
      {tmByGeneration[generationId] && (
        <ul className="game-tm-list">
          {tmByGeneration[generationId].map((gameTm, i) => (
            <li key={i} className="game-tm-item">
              {formatPokemonName(gameTm.game)}: {gameTm.machine}
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
      {pokemons.length > 0 ? (
        <div>
          <Table data={tableData} columns={columns} />
        </div>
      ) : (
        <p>No Pokemons Found</p>
      )}
    </div>
  );
};

export default PokemonsTable;

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../../api/clients";
import { GET_MOVE_POKEMONS } from "../../../api/queries/pokeapi";

import {
  mergePokemonEntries,
  mergeTmEntries,
} from "../../../helpers/mergeEntries";
import { formatName, formatGameName } from "../../../helpers/format";
import { handleSpriteError } from "../../../helpers/error";
import { getSprite } from "../../../helpers/pictures";
import { modifyPokemon } from "../../../helpers/modifyForTable";
import { doesMoveHaveUniqueZMoves } from "../../../helpers/getZMovePower";

import { MoveZMoveTable, Table, Types, Loading } from "../..";

import "./MovePokemonsTable.scss";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
};

const defaultMoveLearnMethod = "level";

const MovePokemonsTable = ({ id, generation, tm }) => {
  let navigate = useNavigate();

  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);

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

  const SpriteComponent = ({ value }) => {
    return (
      <img
        className="pokemon-list-item-sprite clickable"
        onError={handleSpriteError}
        src={getSprite(value)}
        onClick={() => navigate(`/pokemon/${value}`)}
      />
    );
  };

  const NameComponent = ({ value, row }) => {
    return (
      <p
        className="pokemon-list-item-name clickable"
        onClick={() => navigate(`/pokemon/${row.original.spriteId}`)}
      >
        {formatName(value)}
      </p>
    );
  };

  const TypesImageComponent = ({ value }) => {
    return <Types types={value} />;
  };

  const LevelComponent = ({ value }) => {
    return (
      <div>
        {value.map((val, i) => (
          <p key={i}>
            {formatGameName(val.pokemon_v2_versiongroup.name)} Level:{" "}
            {val.level}
          </p>
        ))}
      </div>
    );
  };

  const { tableData, columns } = modifyPokemon({
    pokemons: mergePokemonEntries(pokemons),
    SpriteComponent,
    NameComponent,
    TypesImageComponent,
    LevelComponent,
    hasLevelData: moveType === "level",
  });

  console.log(uniqueZMoves);

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
      {uniqueZMoves && <MoveZMoveTable moves={uniqueZMoves} />}
      {pokemons.length > 0 ? (
        <div className="pokemons-table">
          <Table data={tableData} columns={columns} />
        </div>
      ) : (
        <p>No Pokemons Found</p>
      )}
    </div>
  );
};

export default MovePokemonsTable;

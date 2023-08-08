import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";

import { pokemonAPIClient } from "../../api/clients";
import { GET_POKEMON_MOVES } from "../../api/queries/pokeapi";

import { modifyMoves } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";
import { doesPokemonHaveUniqueZMove } from "../../helpers/zMoveHelper";
import { getGmaxMove } from "../../helpers/maxMoveHelper";

import { Loading, Table, PokemonZMoveTable, PokemonGMaxMoveTable } from "../";
import {
  MoveNameTooltipComponent,
  TypeImageComponent,
  KindImageComponent,
} from "../TableCellComponents/TableCellComponents";

import "./MovesTable.scss";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
  tm: 4,
};

const defaultMoveLearnMethod = "level";

const MovesTable = ({ id, generation, formName }) => {
  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);

  const uniqueZMove = useMemo(() => {
    return generationId === 7 ? doesPokemonHaveUniqueZMove(id) : null;
  }, [id, generationId]);

  const gmaxMove = useMemo(() => {
    return formName === "gmax" && generationId === 8 ? getGmaxMove(id) : null;
  }, [id, generationId]);

  useEffect(() => {
    setGenerationId(generation);
    setMoveType(defaultMoveLearnMethod);
  }, [id]);

  const { data, loading } = useQuery(GET_POKEMON_MOVES, {
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

  const SelectComponent = () => {
    return (
      <>
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
                  {formatName(type)}
                </option>
              );
            })}
          </select>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <>
        <SelectComponent />
        <Loading fullscreen={false} />
      </>
    );
  }

  const { moves } = data.pokemon_move_details[0];

  const { tableData, columns } = modifyMoves({
    moves,
    hasLevel: moveType === "level",
    hasTms: moveType === "tm",
    hasPopUpText: true,
    NameComponent: MoveNameTooltipComponent,
    TypeImageComponent,
    KindImageComponent,
  });

  return (
    <div className="app__moves-table">
      <h3 className="text-center">Moves List</h3>
      <SelectComponent />
      <AnimatePresence>
        <motion.div
          key={JSON.stringify(tableData)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // animate={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
          exit={{ display: "none" }}
          transition={{ duration: 0.5 }}
          className="moves-table"
        >
          {uniqueZMove && <PokemonZMoveTable move={uniqueZMove} />}
          {gmaxMove && <PokemonGMaxMoveTable move={gmaxMove} />}

          {moves.length > 0 ? (
            <>
              <Table data={tableData} columns={columns} />
            </>
          ) : (
            <p>No Moves Found</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MovesTable;

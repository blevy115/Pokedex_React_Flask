import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

import { pokemonAPIClient } from "../../api/clients";
import { GET_POKEMON_MOVES } from "../../api/queries/pokeapi";

import { modifyMoves } from "../../helpers/modifyForTable";
import { Table } from "../";

import "./MovesTable.scss";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
  tm: 4,
};

const defaultMoveLearnMethod = "level";

const MovesTable = ({ id, generation }) => {
  const navigate = useNavigate();
  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);

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
                  {type}
                </option>
              );
            })}
          </select>
        </div>
      </>
    );
  };

  if (loading) {
    return <SelectComponent />;
  }

  const { moves } = data.pokemon_move_details[0];

  const PopUpComponent = ({ value, row }) => {
    const popupText = row.original.popupText;
    const tooltipId = uuidv4();
    return (
      <div className="clickable" data-tip data-tooltip-id={tooltipId}>
        {value}
        <Tooltip
          id={tooltipId}
          effect="solid"
          arrowColor="#fff"
          className="skills-tooltip"
          clickable
          openOnClick
          opacity={1}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            cursor: "default",
          }}
        >
          {popupText}
          <button
            className="popup-button"
            onClick={() => navigate(`/moves/${row.original.moveId}`)}
          >
            More Info
          </button>
        </Tooltip>
      </div>
    );
  };

  const TypeImageComponent = ({ value }) => {
    return (
      <img
        className="table-image"
        src={`/icons/types/${value}.png`}
        alt={`${value} icon`}
      />
    );
  };

  const KindImageComponent = ({ value }) => {
    return (
      <img
        className="table-image"
        src={`/icons/kinds/${value}.png`}
        alt={`${value} icon`}
      />
    );
  };

  const { tableData, columns } = modifyMoves({
    moves,
    hasLevel: moveType === "level",
    PopUpComponent,
    TypeImageComponent,
    KindImageComponent,
  });

  return (
    <>
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
          {moves.length > 0 ? (
            <>
              <Table data={tableData} columns={columns} />
            </>
          ) : (
            <p>No Moves Found</p>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MovesTable;
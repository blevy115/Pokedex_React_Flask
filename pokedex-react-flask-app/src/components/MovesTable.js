import React, { useState, useMemo, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_MOVES } from "../api/pokeapi";
import { pokemonAPIClient } from "../api/clients";
import { modifyMovesForTable } from "../helpers/modifyForTable";
import { useNavigate } from "react-router-dom";
import Table from "./Table";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
  tm: 4,
};

const defaultMoveLearnMethod = "level";

const MovesTable = React.memo(({ id, generation }) => {
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

  if (loading) return <p>Loading...</p>;

  const { moves } = data.pokemon_move_details[0];

  const PopUpComponent = ({ value, row }) => {
    const popupText = row.original.popupText;
    const tooltipId = row.original.moveId + row.original.id;
    return (
      <div className="popup-location" data-tip data-tooltip-id={tooltipId}>
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
            style={{
              cursor: "pointer",
              width: "fit-content",
              marginTop: "1rem",
              padding: "0.5rem",
            }}
            onClick={() => navigate(`/moves/${row.original.moveId}`)}
          >
            More Info
          </button>
        </Tooltip>
      </div>
    );
  };

  const TypeImageComponent = ({ value }) => {
    return <img src={`/icons/types/${value}.png`} alt={`${value} icon`} />;
  };

  const KindImageComponent = ({ value }) => {
    return <img src={`/icons/kinds/${value}.png`} alt={`${value} icon`} />;
  };

  const { tableData, columns } = modifyMovesForTable({
    moves,
    hasLevel: moveType === "level",
    PopUpComponent,
    TypeImageComponent,
    KindImageComponent,
  });

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
      {moves.length > 0 ? (
        <>
          <Table data={tableData} columns={columns} />
        </>
      ) : (
        <p>No Moves Found</p>
      )}
    </>
  );
});

MovesTable.displayName = "MovesTable";

export default MovesTable;

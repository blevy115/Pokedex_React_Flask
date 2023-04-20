import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_MOVES } from "../api/pokeapi";
import { pokemonAPIClient } from "../api/clients";
import { modifyMovesForTable } from "../helpers/modifyForTable";
import Table from "./Table";

const moveTypes = {
  level: 1,
  egg: 2,
  tutor: 3,
  tm: 4,
};

const defaultMoveLearnMethod = "level";

export default function MovesTable({ id, generation }) {
  const [generationId, setGenerationId] = useState(generation);
  const [moveType, setMoveType] = useState(defaultMoveLearnMethod);
  const [currentPopup, setCurrentPopup] = useState({
    popupText: null,
    index: null,
  });

  useEffect(() => {
    setGenerationId(generation);
    setMoveType(defaultMoveLearnMethod);
  }, [id]);

  useEffect(() => {
    setCurrentPopup({
      popupText: null,
      index: null,
    });
  }, [id, generationId, moveType]);

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

  const handlePopupClick = ({ popupText, index }) => {
    if (
      popupText &&
      (currentPopup.popupText !== popupText || currentPopup.index !== index)
    ) {
      setCurrentPopup({ popupText, index });
    } else {
      setCurrentPopup({
        popupText: null,
        index: null,
      });
    }
  };

  const { moves } = data.pokemon_move_details[0];

  // const pokemonExistsInGeneration = moveType === "level" && moves.length > 0;

  const PopUpComponent = ({ value, row }) => {
    const popupText = row.original.popupText;

    return (
      <div
        className="popup-location"
        onClick={() =>
          handlePopupClick({ popupText: popupText, index: row.index })
        }
      >
        {value}
        {currentPopup.popupText === popupText &&
          currentPopup.index === row.index && (
            <div className="popup">{popupText}</div>
          )}
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
}

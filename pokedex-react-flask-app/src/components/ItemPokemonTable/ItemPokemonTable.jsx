import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getSprite } from "../../helpers/pictures";

import { modifyPokemon } from "../../helpers/modifyForTable";
import { handleImageError } from "../../helpers/error";

import { formatName } from "../../helpers/format";

import { Table, Types } from "../";

import "./ItemPokemonTable.scss";

const ItemPokemonTable = ({ list }) => {
  const navigate = useNavigate();
  const generationOptions = useMemo(() => Object.keys(list), [list]);

  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, [generationOptions]);

  if (!generation) return null;

  const SpriteComponent = ({ value }) => {
    return (
      <img
        className="pokemon-list-item-sprite clickable"
        onError={handleImageError}
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

  const { tableData, columns } = modifyPokemon({
    pokemons: list[generation],
    SpriteComponent,
    NameComponent,
    TypesImageComponent,
    hasItemRarityData: true,
  });

  return (
    <div className="app__item-pokemon-table">
      <div className="select-input">
        <label htmlFor="HeldItemPokemonGenerationSelector">Generation:</label>
        <select
          id="HeldItemPokemonGenerationSelector"
          value={generation}
          onChange={(e) => setGeneration(parseInt(e.target.value))}
        >
          {generationOptions.map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      {list[generation].length > 0 ? (
        <div>
          <Table data={tableData} columns={columns} />
        </div>
      ) : (
        <p>No Pokemons Found</p>
      )}
    </div>
  );
};

export default ItemPokemonTable;

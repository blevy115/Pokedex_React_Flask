import React, { useState, useMemo, useEffect } from "react";

import { modifyPokemon } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  SpriteComponent,
  PokemonNameComponent,
  TypesImageComponent,
} from "../TableCellComponents/TableCellComponents";

import "./ItemPokemonTable.scss";

const ItemPokemonTable = ({ list }) => {
  const generationOptions = useMemo(() => Object.keys(list), [list]);

  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, [generationOptions]);

  if (!generation) return null;

  const { tableData, columns } = modifyPokemon({
    pokemons: list[generation],
    SpriteComponent,
    NameComponent: PokemonNameComponent,
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

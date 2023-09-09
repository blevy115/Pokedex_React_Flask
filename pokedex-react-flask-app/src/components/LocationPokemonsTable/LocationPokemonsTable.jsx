import React from "react";
import { modifyLocationEncounters } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  GameComponent,
  SpriteComponent,
  PokemonNameComponent,
} from "../TableCellComponents/TableCellComponents";

const LocationPokemonsTable = ({ pokemonEncounters }) => {

  const { tableData, columns } = modifyLocationEncounters({
    encounters: pokemonEncounters,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    GameComponent,
  });

  return <Table data={tableData} columns={columns}></Table>;
};

export default LocationPokemonsTable;

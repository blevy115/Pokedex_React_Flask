import React from "react";

import { modifyItemPokemonEvolution } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  SpriteComponent,
  PreEvolvedPokemonNameComponent,
  EvolvedPokemonNameComponent,
  TypesImageComponent,
} from "../TableCellComponents/TableCellComponents";

const LocationEvolutions = ({ evolutions }) => {
    const { tableData, columns } = modifyItemPokemonEvolution({
        pokemonsList: evolutions,
        SpriteComponent,
        PreEvolvedNameComponent: PreEvolvedPokemonNameComponent,
        EvolvedNameComponent: EvolvedPokemonNameComponent,
        TypesImageComponent,
      });
      return <Table data={tableData} columns={columns} />;
};

export default LocationEvolutions;

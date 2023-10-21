import React from "react";

import { modifyItemPokemonEvolution } from "../../helpers/modifyForTable";

import { Table } from "../";
import {
  SpriteComponent,
  PreEvolvedPokemonNameComponent,
  EvolvedPokemonNameComponent,
  TypesImageComponent,
} from "../TableCellComponents/TableCellComponents";

import special_item_evolutions from "../../data/special_item_evolutions.json";

const UseEvolutionPokemonTable = ({ list, id }) => {
  const editedList = special_item_evolutions[id]?.hasAddedEvolution
    ? [...list, ...special_item_evolutions[id]["addedEvolution"]].map((item) =>
        special_item_evolutions[id].hasCustomEvolution &&
        special_item_evolutions[id]["customEvolution"][item.id]
          ? special_item_evolutions[id]["customEvolution"][item.id]
          : item
      )
    : list;
  const { tableData, columns } = modifyItemPokemonEvolution({
    pokemonsList: editedList,
    SpriteComponent,
    PreEvolvedNameComponent: PreEvolvedPokemonNameComponent,
    EvolvedNameComponent: EvolvedPokemonNameComponent,
    TypesImageComponent,
  });
  return <Table data={tableData} columns={columns} />;
};

export default UseEvolutionPokemonTable;

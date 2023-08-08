import React from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../../api/clients";
import { GET_ABILITY_POKEMONS } from "../../../api/queries/pokeapi";

import { modifyPokemon } from "../../../helpers/modifyForTable";

import { Loading, Table } from "../..";
import {
  SpriteComponent,
  PokemonNameComponent,
  TypesImageComponent,
  AbilitiesComponent,
} from "../../TableCellComponents/TableCellComponents";

import "./AbilityPokemonsTable.scss";

const AbilityPokemonsTable = ({ id }) => {
  const { data, loading } = useQuery(GET_ABILITY_POKEMONS, {
    variables: { id },
    client: pokemonAPIClient,
  });

  if (loading) return <Loading fullscreen={false} />;

  const { pokemons, id: pageId } = data.ability[0];

  const { tableData, columns } = modifyPokemon({
    pokemons,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    TypesImageComponent,
    AbilitiesComponent,
    hasAbilities: true,
    pageId,
  });

  return (
    <div className="app__ability-pokemon-table">
      {pokemons.length > 0 ? (
        <div>
          <Table data={tableData} columns={columns} />
        </div>
      ) : (
        <p>No Pokemons Found</p>
      )}
    </div>
  );
};

export default AbilityPokemonsTable;

import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineCheck } from "react-icons/hi";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../../api/clients";
import { GET_ABILITY_POKEMONS } from "../../../api/queries/pokeapi";

import { handleImageError } from "../../../helpers/error";
import { getSprite } from "../../../helpers/pictures";
import { modifyPokemon } from "../../../helpers/modifyForTable";

import { Table, TypeList } from "../..";

import "./AbilityPokemonsTable.scss";

const AbilityPokemonsTable = ({ id }) => {
  let navigate = useNavigate();

  const { data, loading } = useQuery(GET_ABILITY_POKEMONS, {
    variables: { id },
    client: pokemonAPIClient,
  });

  if (loading) return <p>Loading...</p>;

  const { pokemons } = data.ability[0];

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

  const NameComponent = ({ value }) => {
    return (
      <p
        className="pokemon-list-item-name clickable"
        onClick={() => navigate(`/pokemon/${value.id}`)}
      >
        {value.name}
      </p>
    );
  };

  const TypesImageComponent = ({ value }) => {
    return <TypeList types={value} />;
  };

  const IsHiddenComponent = ({ value }) => {
    return value ? <HiOutlineCheck className="hidden-checkmark" /> : null;
  };

  const { tableData, columns } = modifyPokemon({
    pokemons: pokemons,
    SpriteComponent,
    NameComponent,
    TypesImageComponent,
    IsHiddenComponent,
    hasHiddenData: true,
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

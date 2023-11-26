import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_EGG_GROUP_INFO } from "../../api/queries/pokeapi";
import { pokemonAPIClient } from "../../api/clients";

import { formatName } from "../../helpers/format";
import { eggGroupNameHelper } from "../../helpers/eggGroupNamehelper";

import { Loading, EggGroupPokemon } from "../../components";

import "./EggGroupDetail.scss";

const EggGroupDetail = () => {
  const params = useParams();
  const { data, loading } = useQuery(GET_EGG_GROUP_INFO, {
    variables: { id: parseInt(params.eggGroupId) },
    client: pokemonAPIClient,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  if (loading) return <Loading />;
  const { name, pokemons, id } = data.pokemon_v2_egggroup[0];
  const eggGroupName = eggGroupNameHelper(name);
  return (
    <div className={`app__egg-group-details`}>
      <div className="app__egg-group-details-info">
        <h1>{formatName(eggGroupName)} Egg Group</h1>
      </div>
      <div className="app__egg-group-table-container">
        <EggGroupPokemon name={eggGroupName} list={pokemons} eggGroupId={id} />
      </div>
    </div>
  );
};

export default EggGroupDetail;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { pokemonAPIClient, backEndClient } from "../../api/clients";
import { GET_ABILITY_INFO } from "../../api/queries/pokeapi";
import { ABILITY_MUTATION } from "../../api/queries/backend";

import { formatPokemonName } from "../../helpers/format";

import { AbilityPokemonsTable } from "../../components";

import "./AbilityDetail.scss";

const AbilityDetail = () => {
  const params = useParams();

  const { data, loading } = useQuery(GET_ABILITY_INFO, {
    variables: { id: parseInt(params.abilityId) },
    client: pokemonAPIClient,
  });

  const [createOrGetAbility] = useMutation(ABILITY_MUTATION, {
    client: backEndClient,
  });

  const name = !loading ? data.ability[0].name : undefined;

  useEffect(() => {
    if (!loading && name) {
      createOrGetAbility({
        variables: { ability_id: params.abilityId, name: name },
      });
    }
  }, [name, params.abilityId, loading]);

  if (loading) return <p>Loading...</p>;

  const { flavor, effect_text } = data.ability[0];

  return (
    <div className="app__ability">
      <div className="app__ability-info">
        <h3>{formatPokemonName(name)}</h3>
        <p>{flavor[0] && flavor[0].text}</p>
        <p>{effect_text[0] && effect_text[0].effect}</p>
      </div>
      <AbilityPokemonsTable id={parseInt(params.abilityId)} />
    </div>
  );
};

export default AbilityDetail;

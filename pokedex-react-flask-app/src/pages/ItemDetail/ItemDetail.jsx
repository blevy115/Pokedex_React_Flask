import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { pokemonAPIClient, backEndClient } from "../../api/clients";
import { GET_ITEM_INFO } from "../../api/queries/pokeapi";
import { ITEM_MUTATION } from "../../api/queries/backend";

import { formatPokemonName } from "../../helpers/format";
import { mergePokemonEntriesHeldItems } from "../../helpers/mergeEntries";

import { ItemPokemonTable } from "../../components";

import "./ItemDetail.scss";

const ItemDetail = () => {
  const params = useParams();

  const { data, loading } = useQuery(GET_ITEM_INFO, {
    variables: { id: parseInt(params.itemId) },
    client: pokemonAPIClient,
  });

  const [createOrGetItem] = useMutation(ITEM_MUTATION, {
    client: backEndClient,
  });

  const name = !loading ? data.item[0].name : undefined;

  useEffect(() => {
    if (!loading && name) {
      createOrGetItem({
        variables: { item_id: params.itemId, name: name },
      });
    }
  }, [name, params.itemId, loading]);

  if (loading) return <p>Loading...</p>;

  const { flavor, held_by_pokemon: heldByPokemon, category } = data.item[0];

  return (
    <div className="app__item">
      <div className="app__item-info">
        <h3>{formatPokemonName(name)}</h3>
        <p>{flavor[0] && flavor[0].text}</p>
        <p>{category && category.name}</p>
      </div>
      < ItemPokemonTable list={mergePokemonEntriesHeldItems(heldByPokemon)}/>
    </div>
  );
};

export default ItemDetail;

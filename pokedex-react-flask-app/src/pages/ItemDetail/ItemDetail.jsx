import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { pokemonAPIClient, backEndClient } from "../../api/clients";
import { GET_ITEM_INFO } from "../../api/queries/pokeapi";
import { ITEM_MUTATION } from "../../api/queries/backend";

import { formatName } from "../../helpers/format";
import { getItemSprite } from "../../helpers/pictures";
import { handleItemError } from "../../helpers/error";
import { mergePokemonEntriesHeldItems } from "../../helpers/mergeEntries";
import { doesItemHaveZMove } from "../../helpers/zMoveHelper";

import { ItemPokemonTable, ItemZMoveTable, Loading } from "../../components";

import "./ItemDetail.scss";

const ItemDetail = () => {
  const params = useParams();

  const { data, loading } = useQuery(GET_ITEM_INFO, {
    variables: { id: parseInt(params.itemId) },
    client: pokemonAPIClient,
  });

  const zMove = useMemo(() => {
    return doesItemHaveZMove(parseInt(params.itemId));
  }, [params.itemId]);

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

  if (loading) return <Loading />;

  const { flavor, held_by_pokemon: heldByPokemon, category } = data.item[0];

  return (
    <div className="app__item">
      <div className="app__item-info">
        <div className="app__item-info-header">
          <img src={getItemSprite(name)} onError={handleItemError} />
          <h3>{formatName(name)}</h3>
        </div>
        <p>{flavor[0] && flavor[0].text}</p>
        {category && <p>Category: {formatName(category.name)}</p>}
      </div>
      <ItemPokemonTable list={mergePokemonEntriesHeldItems(heldByPokemon)} />
      {zMove && <ItemZMoveTable data={zMove}/>}
    </div>
  );
};

export default ItemDetail;

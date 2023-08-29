import React, { useState, useEffect, useMemo } from "react";
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

import {
  HeldEvolutionPokemonTable,
  UseEvolutionPokemonTable,
  ItemPokemonTable,
  ItemZMoveTable,
  Loading,
} from "../../components";

import "./ItemDetail.scss";

const tabsList = {
  evolution_pokemon: {
    name: "Use Item Evolutions",
    component: UseEvolutionPokemonTable,
    modify: (list) => list,
  },
  held_evolution_pokemon: {
    name: "Held Item Evolution",
    component: HeldEvolutionPokemonTable,
    modify: (list) => list,
  },
  held_by_pokemon: {
    name: "Held By Pokemon",
    component: ItemPokemonTable,
    modify: (list) => mergePokemonEntriesHeldItems(list),
  },
};

const ItemDetail = () => {
  const params = useParams();
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState();

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

  useEffect(() => {
    if (loading || !data) return;
    const item = data.item[0];
    const tabs = [];
    if (item.evolution_pokemon.length) tabs.push(tabsList["evolution_pokemon"]);
    if (item.held_evolution_pokemon.length)
      tabs.push(tabsList["held_evolution_pokemon"]);
    if (item.held_by_pokemon.length) tabs.push(tabsList["held_by_pokemon"]);
    setTabs(tabs);
    setSelectedTab(tabs[0]);
  }, [loading, data]);

  if (loading) return <Loading />;

  const { flavor, category } = data.item[0];

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
      <div className="app__type-details-tabs-container">
        <ul className="app__type-details-tabs">
          {tabs.map((tab, i) => (
            <li
              key={i}
              className={`app__type-details-tabs-item ${
                selectedTab === tab ? "active" : ""
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="app__type-table-container">
        {Object.entries(tabsList).map(
          ([key, value]) =>
            selectedTab === tabsList[key] && (
              <value.component
                key={key}
                list={value.modify(data.item[0][key])}
              />
            )
        )}
      </div>
      {zMove && <ItemZMoveTable data={zMove} />}
    </div>
  );
};

export default ItemDetail;

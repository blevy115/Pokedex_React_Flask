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

import special_item_evolutions from "../../data/special_item_evolutions.json";

function modifyList(list, modification) {
  const newList = [...list];
  if (modification.hasCustomEvolution) {
    for (let i = 0; i < newList.length; i++) {
      const evolution = newList[i];
      if (
        modification["customEvolution"] &&
        modification["customEvolution"][evolution.id]
      ) {
        newList[i] = modification["customEvolution"][evolution.id];
      }
    }
  }

  return modification.hasAddedEvolution
    ? [...newList, ...modification["addedEvolution"]]
    : newList;
}

const tabsList = (id) => {
  return {
    evolution_pokemon: {
      name: "Use Item Evolutions",
      component: UseEvolutionPokemonTable,
      modify: (list) =>
        special_item_evolutions["use"][id]
          ? modifyList(list, special_item_evolutions["use"][id])
          : list,
    },
    held_evolution_pokemon: {
      name: "Held Item Evolution",
      component: HeldEvolutionPokemonTable,
      modify: (list) =>
        special_item_evolutions["held"][id]
          ? modifyList(list, special_item_evolutions["held"][id])
          : list,
    },
    held_by_pokemon: {
      name: "Held By Pokemon",
      component: ItemPokemonTable,
      modify: (list) => mergePokemonEntriesHeldItems(list),
    },
  };
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
    if (item.evolution_pokemon.length || special_item_evolutions["use"][params.itemId])
      tabs.push(tabsList(params.itemId)["evolution_pokemon"]);
    if (item.held_evolution_pokemon.length || special_item_evolutions["held"][params.itemId])
      tabs.push(tabsList(params.itemId)["held_evolution_pokemon"]);
    if (item.held_by_pokemon.length)
      tabs.push(tabsList(params.itemId)["held_by_pokemon"]);
    setTabs(tabs);
    setSelectedTab(tabs[0]);
  }, [loading, data]);

  if (loading) return <Loading />;

  const { flavor, category } = data.item[0];

  return (
    <div className="app__item-details">
      <div className="app__item-details-info">
        <div className="app__item-details-info-header">
          <img src={getItemSprite(name)} onError={handleItemError} />
          <h3>{formatName(name)}</h3>
        </div>
        <p>{flavor[0] && flavor[0].text}</p>
        {category && <p>Category: {formatName(category.name)}</p>}
        <div className="app__item-details-tabs-container">
          <ul className="app__item-details-tabs">
            {tabs.map((tab, i) => (
              <li
                key={i}
                className={`app__item-details-tabs-item ${
                  selectedTab === tab ? "active" : ""
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedTab && (
        <div className="app__item-table-container">
          {Object.entries(tabsList(params.itemId)).map(
            ([key, value]) =>
              selectedTab.name === tabsList(params.itemId)[key].name && (
                <value.component
                  key={key}
                  list={value.modify(data.item[0][key])}
                />
              )
          )}
        </div>
      )}

      {zMove && <ItemZMoveTable data={zMove} />}
    </div>
  );
};

export default ItemDetail;

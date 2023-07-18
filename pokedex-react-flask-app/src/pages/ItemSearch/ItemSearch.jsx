import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_ITEMS_LIST_BY_NAME } from "../../api/queries/pokeapi";

import { ItemsList } from "../../components";

import "./ItemSearch.scss";

const ItemSearch = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    GET_ITEMS_LIST_BY_NAME,
    {
      variables: { name: `%${textInput.replace(" ", "-")}%` },

      skip: !textInput,
      client: pokemonAPIClient,
    }
  );

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);


console.log(list, loadingList)
  return (
    <div className="app__item-search">
      <h2 className="header-text">Welcome {user?.name}</h2>
      <div className="app__item-search-field">
        <label htmlFor="app__item-search-field">Search For Items</label>
        <input
          id="item-search-field"
          ref={inputRef}
          value={textInput}
          onChange={(val) => setTextInput(val.target.value)}
        />
      </div>

      {!loadingList && list ? (
        <ItemsList list={list.items_list} />
      ) : undefined}
    </div>
  );
};

export default ItemSearch;

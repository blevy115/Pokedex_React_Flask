import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_ITEMS_LIST_BY_NAME } from "../../api/queries/pokeapi";

import { ItemsList, DebouncedInput, Loading } from "../../components";

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

  return (
    <div className="app__item-search">
      <h2 className="header-text">Welcome {user?.name}</h2>
      <div className="app__item-search-field">
        <DebouncedInput
          id="app__item-search-field"
          onValueChange={setTextInput}
          ref={inputRef}
          label="Search For Items"
          placeholder="Items"
          debouceTime={400}
        />
      </div>
      {loadingList && <Loading fullscreen={false} />}
      {!loadingList && list ? <ItemsList list={list.items_list} /> : undefined}
    </div>
  );
};

export default ItemSearch;

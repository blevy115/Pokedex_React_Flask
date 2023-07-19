import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_ABILITIES_LIST_BY_NAME } from "../../api/queries/pokeapi";

import { AbilitiesList } from "../../components";

import "./AbilitySearch.scss";

const AbilitySearch = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    GET_ABILITIES_LIST_BY_NAME,
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
    <div className="app__ability-search">
      <h2 className="header-text">Welcome {user?.name}</h2>
      <div className="app__ability-search-field">
        <label htmlFor="app__ability-search-field">Search For Abilities</label>
        <input
          id="ability-search-field"
          ref={inputRef}
          value={textInput}
          onChange={(val) => setTextInput(val.target.value)}
        />
      </div>

      {!loadingList && list ? (
        <AbilitiesList list={list.abilities_list} />
      ) : undefined}
    </div>
  );
};

export default AbilitySearch;

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_ABILITIES_LIST_BY_NAME } from "../../api/queries/pokeapi";

import { AbilitiesList, DebouncedInput, Loading } from "../../components";

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
        <DebouncedInput
          id="app__ability-search-field"
          onValueChange={setTextInput}
          ref={inputRef}
          label="Search For Ability"
          placeholder="Ability"
          debouceTime={400}
        />
      </div>
      {loadingList && <Loading fullscreen={false} />}
      {!loadingList && list ? (
        <AbilitiesList list={list.abilities_list} />
      ) : undefined}
    </div>
  );
};

export default AbilitySearch;

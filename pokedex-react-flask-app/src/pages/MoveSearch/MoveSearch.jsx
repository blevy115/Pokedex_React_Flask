import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_MOVES_LIST_BY_NAME } from "../../api/queries/pokeapi";

import { MovesList } from "../../components";

import "./MoveSearch.scss";

const MoveSearch = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    GET_MOVES_LIST_BY_NAME,
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
    <div className="app__move-search">
      <h2 className="header-text">Welcome {user?.name}</h2>
      <div className="app__move-search-field">
        <label htmlFor="app__move-search-field">Search For Moves</label>
        <input
          id="move-search-field"
          ref={inputRef}
          value={textInput}
          onChange={(val) => setTextInput(val.target.value)}
        />
      </div>

      {!loadingList && list ? <MovesList list={list.moves_list} /> : undefined}
    </div>
  );
};

export default MoveSearch;

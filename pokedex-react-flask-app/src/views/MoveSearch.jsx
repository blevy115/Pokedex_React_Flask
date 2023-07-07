import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MOVES_LIST_BY_NAME } from "../api/pokeapi";
import MovesList from "../components/MovesList";
import { pokemonAPIClient } from "../api/clients";
import NavBar from "../components/NavBar";

const MoveSearch = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    GET_MOVES_LIST_BY_NAME,
    {
      variables: { name: `%${textInput}%` },

      skip: !textInput,
      client: pokemonAPIClient,
    }
  );

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="App">
      <NavBar />
      <h2>Welcome {user?.name}</h2>

      <p>Search For Moves</p>
      <input
        ref={inputRef}
        value={textInput}
        onChange={(val) => setTextInput(val.target.value)}
      ></input>
      {!loadingList && list ? <MovesList list={list.moves_list} /> : undefined}
    </div>
  );
};

export default MoveSearch;

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";
import { GET_LOCATIONS_LIST_BY_NAME } from "../../api/queries/pokeapi";

import { LocationsList, DebouncedInput, Loading } from "../../components";

import "./LocationSearch.scss";

const LocationSearch = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [textInput, setTextInput] = useState("");
  const { data: list, loading: loadingList } = useQuery(
    GET_LOCATIONS_LIST_BY_NAME,
    {
      variables: { name: `%${textInput.replaceAll(" ", "-")}%` },

      skip: !textInput,
      client: pokemonAPIClient,
    }
  );

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="app__location-search">
      <h2 className="header-text">Welcome {user?.name}</h2>
      <div className="app__location-search-field">
        <DebouncedInput
          id="app__location-search-field"
          onValueChange={setTextInput}
          ref={inputRef}
          label="Search For Locations"
          placeholder="Locations"
          debouceTime={400}
        />
      </div>
      {loadingList && <Loading fullscreen={false} />}
      {!loadingList && list ? <LocationsList list={list.locations_list} /> : undefined}
    </div>
  );
};

export default LocationSearch;

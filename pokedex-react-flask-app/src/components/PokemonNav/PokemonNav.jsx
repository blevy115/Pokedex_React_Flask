import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

import { formatName } from "../../helpers/format";
import { getSprite } from "../../helpers/pictures";

import "./PokemonNav.scss";

const PokemonNav = ({ id, name }) => {
  const prevPokemonRef = useRef(null);
  const nextPokemonRef = useRef(null);

  useEffect(() => {
    if (id !== 1) {
      prevPokemonRef.current.style.visibility = "visible";
    }
    nextPokemonRef.current.style.visibility = "visible";
  }, [id]);

  const prevPokemonKey = id - 1;
  const nextPokemonKey = id + 1;

  function pokemonDoesNotExist(ref) {
    ref.current.style.visibility = "hidden";
  }

  return (
    <div className="pokemon-headers">
      <div
        key={prevPokemonKey}
        ref={prevPokemonRef}
        className={`pokemon-nav-option ${id <= 1 ? "hide" : ""}`}
      >
        <Link to={`/pokemon/${id - 1}`}>
          <HiOutlineChevronLeft />
          <img
            onError={() => pokemonDoesNotExist(prevPokemonRef)}
            src={getSprite(id - 1)}
          />
        </Link>
      </div>
      <div className="pokemon-name">
        <p>#{id}</p>
        <h3>{formatName(name)}</h3>
      </div>
      <div key={nextPokemonKey} ref={nextPokemonRef} className="pokemon-nav-option">
        <Link to={`/pokemon/${id + 1}`}>
          <img
            onError={() => pokemonDoesNotExist(nextPokemonRef)}
            src={getSprite(id + 1)}
          />

          <HiOutlineChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default PokemonNav;

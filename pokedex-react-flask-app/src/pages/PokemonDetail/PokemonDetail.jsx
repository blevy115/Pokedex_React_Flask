import React, { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

import { GET_POKEMON_INFO } from "../../api/queries/pokeapi";
import {
  CHECK_POKEMON_EXISTS,
  GET_USER_POKEMONS,
  POKEMON_MUTATION,
  USER_POKEMON_MUTATION,
} from "../../api/queries/backend";

import { pokemonAPIClient, backEndClient } from "../../api/clients";

import {
  TypeEffectiveness,
  PokemonImage,
  StatChart,
  Abilities,
  MovesTable,
  ShinyCounter,
  GenerationSelector,
  GenderRatio,
  TypeList,
} from "../../components";

import { formatPokemonName } from "../../helpers/format";
import { getSprite } from "../../helpers/pictures";
import { handleImageError } from "../../helpers/error";

import "./PokemonDetail.scss";

const PokemonDetail = () => {
  const params = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data, loading } = useQuery(GET_POKEMON_INFO, {
    variables: { id: parseInt(params.pokemonId) },
    client: pokemonAPIClient,
  });
  const { data: pokemonExistsData, loading: pokemonDataLoading } = useQuery(
    CHECK_POKEMON_EXISTS,
    {
      variables: { pokemon_id: parseInt(params.pokemonId) },
      client: backEndClient,
    }
  );
  const { data: userPokemonsData, loading: userPokemonsLoading } = useQuery(
    GET_USER_POKEMONS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
    }
  );

  const [createPokemon] = useMutation(POKEMON_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: CHECK_POKEMON_EXISTS,
        variables: { pokemon_id: parseInt(params.pokemonId) },
      },
    ],
  });

  const [mutateUserPokemonRelation] = useMutation(USER_POKEMON_MUTATION, {
    client: backEndClient,
    refetchQueries: [
      {
        query: GET_USER_POKEMONS,
        variables: { user_id: user.id },
      },
    ],
  });
  const name = !loading ? data.pokemon_details[0].name : undefined;

  const isAFavourite = useMemo(() => {
    return !userPokemonsLoading
      ? userPokemonsData.userPokemons.some(
          (pokemon) =>
            pokemon.pokemons.pokemonId == params.pokemonId && pokemon.isActive
        )
      : undefined;
  }, [userPokemonsData, userPokemonsLoading, params.pokemonId]);

  useEffect(() => {
    if (
      !loading &&
      name &&
      !pokemonDataLoading &&
      pokemonExistsData.pokemons.length === 0
    ) {
      createPokemon({
        variables: { pokemon_id: params.pokemonId, name: name },
      });
    }
  }, [name, params.pokemonId, loading, pokemonDataLoading, pokemonExistsData]);

  function handleUserPokemonLinking(e) {
    e.preventDefault();
    mutateUserPokemonRelation({
      variables: {
        user_id: user.id,
        pokemon_id: params.pokemonId,
        is_active: !isAFavourite,
      },
    });
  }

  if (loading) return <p>Loading...</p>;
  const { height, weight, types, info, stats, abilities, form } =
    data.pokemon_details[0];

  const generation = form[0].pokemon_v2_versiongroup.generation_id;
  
  return (
    <div className="app__pokemon-detail">
      <div className="app-pokemon-detail-info">
        <div className="pokemon-headers">
          <div className={parseInt(params.pokemonId) <= 1 ? "hide" : ""}>
            <Link to={`/pokemon/${parseInt(params.pokemonId) - 1}`}>
              <img
                onError={handleImageError}
                src={getSprite(parseInt(params.pokemonId) - 1)}
              />
              <HiOutlineChevronLeft />
            </Link>
          </div>
          <p className="pokemon-name">
            {formatPokemonName(name)} #{params.pokemonId}
          </p>

          <div>
            <Link to={`/pokemon/${parseInt(params.pokemonId) + 1}`}>
              <img
                onError={handleImageError}
                src={getSprite(parseInt(params.pokemonId) + 1)}
              />

              <HiOutlineChevronRight />
            </Link>
          </div>
        </div>

        <PokemonImage id={params.pokemonId} />
        <TypeList types={types} />
        <button
          className="favourite-button clickable"
          onClick={handleUserPokemonLinking}
        >
          {isAFavourite ? "Unfavourite" : "Favourite"}
        </button>
        <div className="pokemon-detail-characteristics">
          <p>Generation: {generation}</p>
          <p>Height: {(height / 10).toFixed(1)} m</p>
          <p>Weight: {(weight / 10).toFixed(1)} kg</p>
        </div>
        <GenderRatio hasDifference={info.has_gender_differences} rate={info.gender_rate}/>
          <GenerationSelector
            generation={generation}
            pokedexes={info.pokedexes}
          />
          <Abilities abilities={abilities} />
          <TypeEffectiveness
            types={types.map((type) => type.pokemon_v2_type.name)}
          />
        {isAFavourite && (
          <ShinyCounter
            pokemonId={params.pokemonId}
            userPokemonsData={userPokemonsData}
          />
        )}
      </div>
      <div className="app-pokemon-detail-stats-and-moves">
        <StatChart baseStats={stats} isAFavourite={isAFavourite} />
        <MovesTable
          id={parseInt(params.pokemonId)}
          generation={form[0].pokemon_v2_versiongroup.generation_id}
        />
      </div>
    </div>
  );
};

export default PokemonDetail;

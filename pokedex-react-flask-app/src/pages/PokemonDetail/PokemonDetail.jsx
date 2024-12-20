import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { GET_POKEMON_INFO } from "../../api/queries/pokeapi";
import {
  GET_USER_POKEMONS,
  POKEMON_MUTATION,
  USER_POKEMON_MUTATION,
} from "../../api/queries/backend";

import { pokemonAPIClient, backEndClient } from "../../api/clients";

import {
  TypeEffectiveness,
  PokemonCry,
  PokemonImage,
  PokemonNav,
  StatChart,
  Abilities,
  MovesTable,
  ShinyCounter,
  GenerationSelector,
  GenderRatio,
  Types,
  HeldItems,
  Loading,
  EvolutionaryChain,
  PokemonForms,
  EncounterLocations,
} from "../../components";

import { formatName } from "../../helpers/format";
import { eggGroupNameHelper } from "../../helpers/eggGroupNamehelper";

import { convertStats, getEvYield } from "../../helpers/statModifier";
import { calculateCatchPercent } from "../../helpers/calculateCatchPercent";

import "./PokemonDetail.scss";

const PokemonDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const { data, loading } = useQuery(GET_POKEMON_INFO, {
    variables: { id: parseInt(params.pokemonId) },
    client: pokemonAPIClient,
  });

  const { data: userPokemonsData, loading: userPokemonsLoading } = useQuery(
    GET_USER_POKEMONS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
      skip: role === "guest",
    }
  );

  const [createOrGetPokemon] = useMutation(POKEMON_MUTATION, {
    client: backEndClient,
  });

  const [mutateUserPokemonRelation] = useMutation(USER_POKEMON_MUTATION, {
    client: backEndClient,
    refetchQueries:
      role !== "guest"
        ? [
            {
              query: GET_USER_POKEMONS,
              variables: { user_id: user.id },
            },
          ]
        : [],
  });
  const name = !loading ? data.pokemon_details[0].name : undefined;
  const types = !loading ? data.pokemon_details[0].types : undefined;
  const stats = !loading ? data.pokemon_details[0].stats : undefined;

  const isAFavourite = useMemo(() => {
    if (role === "guest") return false;
    return !userPokemonsLoading && userPokemonsData
      ? userPokemonsData.userPokemons.some(
          (pokemon) =>
            pokemon.pokemons.pokemonId == params.pokemonId && pokemon.isActive
        )
      : undefined;
  }, [userPokemonsData, userPokemonsLoading, params.pokemonId]);

  useEffect(() => {
    if (!loading && name && types && stats) {
      createOrGetPokemon({
        variables: {
          pokemon_id: params.pokemonId,
          name: name,
          base_stats: Object.values(convertStats(stats)),
          types: types.map((t) => t.pokemon_v2_type.id),
        },
      });
    }
  }, [name, types, stats, params.pokemonId, loading]);

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
  if (loading) return <Loading />;
  const {
    height,
    weight,
    info,
    abilities,
    form,
    encounters,
    held_items: heldItems,
  } = data.pokemon_details[0];

  const generation = form[0].pokemon_v2_versiongroup.generation_id;
  const pokemonIdInt = parseInt(params.pokemonId);

  const evYield = getEvYield(stats);

  return (
    <div
      className={`app__pokemon-detail ${
        types.length === 1
          ? `${types[0].pokemon_v2_type.name}-color-5`
          : `${types[0].pokemon_v2_type.name}-${types[1].pokemon_v2_type.name}-color-6`
      }`}
    >
      <div className="app-pokemon-detail-info">
        <PokemonNav name={name} id={pokemonIdInt} />
        <GenerationSelector
          generation={generation}
          pokedexes={info.pokedexes}
        />
        <PokemonCry id={params.pokemonId} />
        <PokemonImage id={params.pokemonId} />
        <Types types={types} />
        {role !== "guest" && (
          <>
            <button
              className="favourite-button clickable"
              onClick={handleUserPokemonLinking}
            >
              {isAFavourite ? "Unfavourite" : "Favourite"}
            </button>
            {isAFavourite && <ShinyCounter pokemonId={pokemonIdInt} />}
          </>
        )}

        <PokemonForms forms={info.forms} pokemonId={pokemonIdInt} />
        <EvolutionaryChain
          chain={info.evolutionChain}
          pokemonId={pokemonIdInt}
        />
        <div className="pokemon-details-info-traits">
          <div>
            <div className="pokemon-detail-characteristics">
              <p>Generation: {generation}</p>
              <p className="no-wrap">
                Capture Rate: {info.capture_rate}{" "}
                <span className="small">
                  ({calculateCatchPercent({ catchRate: info.capture_rate })})
                </span>
              </p>
              <p className="no-wrap">Height: {(height / 10).toFixed(1)} m</p>
              <p className="no-wrap">Weight: {(weight / 10).toFixed(1)} kg</p>
              <p>
                Egg Groups:{" "}
                {info.egg_groups.map((eggGroup, i) => (
                  <span
                    key={i}
                    className="clickable pokemon-egg-group"
                    onClick={() =>
                      navigate(`/egg-groups/${eggGroup.pokemon_v2_egggroup.id}`)
                    }
                  >
                    {formatName(
                      eggGroupNameHelper(eggGroup.pokemon_v2_egggroup.name)
                    )}
                  </span>
                ))}
              </p>
            </div>
            <Abilities abilities={abilities} />
            <div className="text-center">
              <h4>EV Yield</h4>
              {Object.entries(evYield.evs).map((stat) => {
                return (
                  <p key={stat[0]} className="no-wrap">
                    {formatName(stat[0])}: {stat[1]}
                  </p>
                );
              })}
              <p>Total: {evYield.total}</p>
            </div>
          </div>
          <div>
            {heldItems.length > 0 && <HeldItems items={heldItems} />}
            <GenderRatio
              hasDifference={info.has_gender_differences}
              rate={info.gender_rate}
            />
            <TypeEffectiveness
              types={types.map((type) => type.pokemon_v2_type.name)}
            />
          </div>
        </div>
      </div>
      <div className="app-pokemon-detail-stats-and-moves">
        <StatChart baseStats={stats} isAFavourite={isAFavourite} />
        {encounters.length > 0 && (
          <EncounterLocations encounters={encounters} />
        )}
        <MovesTable
          id={pokemonIdInt}
          generation={form[0].pokemon_v2_versiongroup.generation_id}
          formName={form[0].form_name}
        />
      </div>
    </div>
  );
};

export default PokemonDetail;

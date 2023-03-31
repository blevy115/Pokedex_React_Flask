import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_INFO } from "../api/pokeapi";
import TypeEffectiveness from "../components/TypeEffectiveness";
import PokemonImages from "../components/PokemonImages";
import MovesList from "../components/MovesList";
import { pokemonAPIClient } from "../api/clients";

export default function PokemonCard() {
  const params = useParams();
  const { data, loading } = useQuery(GET_POKEMON_INFO, {
    variables: { id: parseInt(params.pokemonId) },
    client: pokemonAPIClient
  });
  if (loading) return <p>Loading...</p>;
  const {
    name,
    types,
    info,
    stats,
    abilities,
    level_moves,
    egg_moves,
    tm_moves,
  } = data.pokemon_details[0];
  return (
    <>
      <Link to="/">Back to List</Link>
      <div style={{ margin: "auto", width: "60%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Link to={`/pokemon/${parseInt(params.pokemonId) - 1}`}>
            Previous
          </Link>
          <p style={{ textAlign: "center" }}>{name}</p>
          <Link to={`/pokemon/${parseInt(params.pokemonId) + 1}`}>Next</Link>
        </div>
        <PokemonImages id={params.pokemonId} />
        <div>
          <p>Generation: {info.generation_id}</p>
          {info.has_gender_differences ? (
            <p>Has Gender Differences</p>
          ) : undefined}
          <p>Types</p>
          <ul style={{ listStyleType: "none" }}>
            {types.map((type) => {
              return (
                <li key={type.pokemon_v2_type.id}>
                  <img
                    src={`/icons/types/${type.pokemon_v2_type.name}.png`}
                    alt={`${type.pokemon_v2_type.name} icon`}
                  />
                </li>
              );
            })}
          </ul>
          <TypeEffectiveness
            types={types.map((type) => type.pokemon_v2_type.name)}
          />
          <p>Stats</p>
          <ul>
            {stats.map((stat) => {
              return (
                <li key={stat.pokemon_v2_stat.id}>
                  {stat.pokemon_v2_stat.name}: {stat.base_stat}{" "}
                  <b>{stat.effort ? `${stat.effort} EV` : undefined}</b>
                </li>
              );
            })}
          </ul>
          <p>Abilities</p>
          <ol>
            {abilities.map((ability) => {
              const hasAbilityText = ability.pokemon_v2_ability.text.length > 0;
              return (
                <div key={ability.pokemon_v2_ability.id}>
                  <li>
                    {ability.pokemon_v2_ability.name}
                    {ability.is_hidden && " (Hidden)"}
                    <span className="HoverToSee">
                      {hasAbilityText
                        ? ability.pokemon_v2_ability.text[0].short_effect
                        : undefined}
                    </span>
                  </li>
                </div>
              );
            })}
          </ol>
        </div>
        <MovesList
          levelMoves={level_moves.slice().sort((a, b) => a.level - b.level)}
          eggMoves={egg_moves}
          tmMoves={tm_moves}
        />
      </div>
    </>
  );
}

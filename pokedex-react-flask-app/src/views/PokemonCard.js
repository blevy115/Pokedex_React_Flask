import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_POKEMON_INFO } from "../api/pokeapi";
import TypeEffectiveness from "../components/TypeEffectiveness";
import PokemonImages from "../components/PokemonImages";

export default function PokemonCard() {
  const params = useParams();
  const { data, loading } = useQuery(GET_POKEMON_INFO, {
    variables: { id: parseInt(params.pokemonId) },
  });
  if (loading) return <p>Loading...</p>;
  // const {name, types, stats, abilities, level_moves, egg_moves, tm_moves} = data.pokemon_details[0]
  const { name, types, info, stats, abilities } = data.pokemon_details[0];
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="/">Back to List</Link>
        <Link to={`/pokemon/${parseInt(params.pokemonId) - 1}`}>Previous</Link>
        <Link to={`/pokemon/${parseInt(params.pokemonId) + 1}`}>Next</Link>
      </div>

      <div style={{ margin: "auto", width: "60%" }}>
        <p style={{ textAlign: "center" }}>{name}</p>
        <PokemonImages id={params.pokemonId} />
        <p>Generation: {info.generation_id}</p>
        {info.has_gender_differences ? (
          <p>Has Gender Differences</p>
        ) : undefined}
        <p>Types</p>
        <ul>
          {types.map((type) => {
            return (
              <li key={type.pokemon_v2_type.id}>{type.pokemon_v2_type.name}</li>
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
                      ? `: ${ability.pokemon_v2_ability.text[0].short_effect}`
                      : undefined}
                  </span>
                </li>
              </div>
            );
          })}
        </ol>
      </div>
    </>
  );
}

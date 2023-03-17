import React from "react"
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client"

const GET_POKEMON_INFO = gql`
query getPokemonInfo($id: Int!) {
    pokemon_details: pokemon_v2_pokemon(
        where: {id: {_eq: $id}}
    ) {
      id
      name

      types: pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
          id
        }
      }

      stats: pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
          id
        }
      }

      abilities: pokemon_v2_pokemonabilities {
        pokemon_v2_ability {
          name
          id
        }
        is_hidden
      }

      level_moves: pokemon_v2_pokemonmoves(where: {pokemon_id: {_eq: 1}, pokemon_v2_movelearnmethod: {name: {_eq: "level-up"}}}, distinct_on: move_id) {
        pokemon_v2_move {
          name
        }
        level
      }
      egg_moves: pokemon_v2_pokemonmoves(where: {pokemon_id: {_eq: 1}, pokemon_v2_movelearnmethod: {name: {_eq: "egg"}}}, distinct_on: move_id) {
        pokemon_v2_move {
          name
        }
      }
      tm_moves: pokemon_v2_pokemonmoves(where: {pokemon_id: {_eq: 1}, pokemon_v2_movelearnmethod: {name: {_eq: "machine"}}}, distinct_on: move_id) {
        pokemon_v2_move {
          name
        }
      }

    }
  }
`

const getImagePath = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export default function PokemonCard(){
    const params = useParams();
    console.log(params)
    const {data, loading} = useQuery(GET_POKEMON_INFO, {
        variables: {id: parseInt(params.pokemonId)}
    })
    console.log(data)
    if (loading) return <p>Loading...</p>
    // const {name, types, stats, abilities, level_moves, egg_moves, tm_moves} = data.pokemon_details[0]
    const {name, types, stats, abilities} = data.pokemon_details[0]
    return (
        <div style={{margin: "auto", width: "50%"}}>
        <p>{name}</p>
        <img src={getImagePath(params.pokemonId)} />
        <p>Types</p>
        <ul>
        {types.map((type) => {
            return <li key={type.pokemon_v2_type.id}>{type.pokemon_v2_type.name}</li>
        })}
        </ul>
        <p>Stats</p>
        <ul>
        {stats.map((stat) => {
            return <li key={stat.pokemon_v2_stat.id}>{stat.pokemon_v2_stat.name}: {stat.base_stat}</li>
        })}
        </ul>
        <p>Abilities</p>
        <ol>
        {abilities.map((ability) => {
            return <li key={ability.pokemon_v2_ability.id}>{ability.pokemon_v2_ability.name}{ability.is_hidden && "(Hidden)"}</li>
        })}
        </ol>
        </div>
    )
}
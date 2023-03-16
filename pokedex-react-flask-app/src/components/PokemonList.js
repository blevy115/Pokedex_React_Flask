import React from "react"

export default function PokemonList({ list }){
    return (
            <ul>
                {list.map(({name, id}) => (<li key={id}>{name}</li>))}
            </ul>
    )
}
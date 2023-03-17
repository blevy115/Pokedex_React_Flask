import React from "react"
import {useNavigate} from "react-router-dom"

export default function PokemonList({ list }){
    let navigate = useNavigate();
    return (
            <ul>
                {list.map(({name, id}) => (
                <li 
                    key={id}
                    onClick={() => navigate(`/pokemon/${id}`)}
                >
                    {name}
                </li>
                ))}
            </ul>
    )
}
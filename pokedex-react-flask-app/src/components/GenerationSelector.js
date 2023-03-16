import React from "react"

export default function GenerationSelector({generation, generations, setGeneration}) {
    return (<>
    <h2>Gen {generation} Pokemon</h2>
        <select id="generation"
        onChange={(e) => setGeneration(e.target.value)}
        value = {generation}
          >
          Generation
        {generations.map(({id}) => (<option key={id} value={id}>{id}</option>))}
        </select></>

    )
}
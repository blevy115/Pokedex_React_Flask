import React, {useState, useRef} from "react"

const getImagePath = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}


const getShinyImagePath= (id) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
}

export default function PokemonImages({id}) {
    const [loading, setLoading] = useState(true);
    const imageCounter = useRef(0)
    const imageLoaded = () => {
        imageCounter.current += 1;
        if (imageCounter.current == 2) { // Number of Images
            setLoading(false)
        }
    }
    return (<>
        <div style={{display: loading ? "block" : "none", textAlign: "center"}}>
          Loading images...
        </div>
        <div style={{display: loading ? "none" : "flex", justifyContent: "center", alignItems: "space-between"}}>
        <div>
          <p style={{textAlign: "center"}}>Regular</p>
        <img src={getImagePath(id)} onLoad={imageLoaded}/>
        </div>
        <div>
        <p style={{textAlign: "center"}}>Shiny</p>
        <img src={getShinyImagePath(id)} onLoad={imageLoaded}/>
        </div>
        </div>
        </>
    )
} 
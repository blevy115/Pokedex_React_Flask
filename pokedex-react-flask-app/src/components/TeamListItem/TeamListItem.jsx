import React from "react";
import { useNavigate } from "react-router-dom";
import { getSprite } from "../../helpers/pictures";
import { formatName } from "../../helpers/format";
import { Tooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";



import "./TeamListItem.scss";

const TeamListItem = ({ team }) => {
  console.log(team);
  const navigate = useNavigate()
  return (
    <div className="team-list-item">
      <h4 className="team-list-name">{team.name}</h4>
      <div className="team-pokemons-container">
      {team.pokemons.map((tp, index) => {
        const itemTooltipId = uuidv4();
        const pokemonTooltipId = uuidv4();

        return (
        <div key={index}>
          <div className="container">
            <div className="images-container clickable">
              <div className="image-wrapper"  data-tip
              data-tooltip-id={pokemonTooltipId}>
                <img
                  src="/icons/loading/pokeball.png"
                  alt="Image A"
                  className="image-a"
                ></img>
                <img
                  src={getSprite(tp.pokemon.pokemonId)}
                  alt="Image B"
                  className="image-b"
                  onClick={() => navigate(`/pokemon/${tp.pokemon.pokemonId}`)}
                ></img>
                <Tooltip
                id={pokemonTooltipId}
                effect="solid"
                arrowColor="#fff"
                className="tooltip-box"
                offset={-10}
                opacity={1}
              >
                {formatName(tp.pokemon.name)}
              </Tooltip>
              </div>
              <div className="small-image-wrapper"  data-tip
              data-tooltip-id={itemTooltipId}>
                <img
                  src="/icons/error/item-ball.png"
                  alt="Small Image"
                  className="small-image"
                  onClick={() => navigate(`/items/${tp.item.itemId}`)}
                ></img>
                 <Tooltip
                id={itemTooltipId}
                effect="solid"
                arrowColor="#fff"
                className="tooltip-box"
                opacity={1}
              >
                {formatName(tp.item.name)}
              </Tooltip>
              </div>
            </div>
          </div>
        </div>
      
      )})}
      <button className="clickable edit-button" onClick={() => navigate(`/teams/${team.teamId}`)}>Edit</button>
      </div>
    </div>
  );
};

export default TeamListItem;

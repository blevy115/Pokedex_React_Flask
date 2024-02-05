import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { BsTrash2 } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

import { GET_USER_TEAMS, USER_TEAM_DELETION } from "../../api/queries/backend";
import { backEndClient } from "../../api/clients";

import { getSprite } from "../../helpers/pictures";
import { formatName } from "../../helpers/format";

import "./TeamListItem.scss";

const TeamListItem = ({ team }) => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const navigate = useNavigate();
  const [deleteTeam] = useMutation(USER_TEAM_DELETION, {
    client: backEndClient,
    variables: {
      user_id: user.id,
      team_id: team.teamId,
    },
    refetchQueries: [
      {
        query: GET_USER_TEAMS,
        variables: { user_id: user.id },
      },
    ],
  });

  return (
    <div className="team-list-item">
      <MdModeEdit
        className="edit-button"
        onClick={() => navigate(`/teams/${team.teamId}`)}
      />
      <BsTrash2 className="close-button" onClick={() => deleteTeam()} />
      <h4 className="team-list-name">{team.name}</h4>
      <div className="team-pokemons-container">
        {team.pokemons.map((tp, index) => {
          const itemTooltipId = uuidv4();
          const pokemonTooltipId = uuidv4();
          const hasPokemon = tp.pokemon;
          return (
            <div key={index}>
              <div key={index} className="container">
                <div className="images-container clickable">
                  <div
                    className="image-wrapper"
                    data-tip
                    data-tooltip-id={pokemonTooltipId}
                  >
                    <img
                      src="/icons/loading/pokeball.png"
                      alt="Image A"
                      className="image-a"
                    ></img>
                    {hasPokemon ? (
                      <img
                        src={getSprite(tp.pokemon.pokemonId)}
                        alt="Image B"
                        className="image-b"
                        onClick={() =>
                          navigate(`/pokemon/${tp.pokemon.pokemonId}`)
                        }
                      ></img>
                    ) : null}
                    <Tooltip
                      id={pokemonTooltipId}
                      effect="solid"
                      arrowColor="#fff"
                      className="tooltip-box"
                      offset={-10}
                      opacity={1}
                    >
                      {hasPokemon ? formatName(tp.pokemon.name) : null}
                    </Tooltip>
                  </div>{" "}
                  {tp.item ? (
                    <div
                      className="small-image-wrapper"
                      data-tip
                      data-tooltip-id={itemTooltipId}
                    >
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
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
        {/* <button
          className="clickable edit-button"
          onClick={() => navigate(`/teams/${team.teamId}`)}
        >
          Edit
        </button> */}
      </div>
    </div>
  );
};

export default TeamListItem;

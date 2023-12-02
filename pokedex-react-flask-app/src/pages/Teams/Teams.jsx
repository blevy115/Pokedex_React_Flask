import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import { GET_USER_TEAMS } from "../../api/queries/backend";

// import { formatName } from "../../helpers/format";
// import { handleSpriteError } from "../../helpers/error";
// import { getSprite } from "../../helpers/pictures";

import { Loading } from "../../components";

import "./Teams.scss";

const Teams = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([])
  let navigate = useNavigate();
  console.log(navigate)

  const { data: userTeamsData, loading: userTeamsLoading } = useQuery(
    GET_USER_TEAMS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
    }
  );

  useEffect(() => {
    if (userTeamsData) {
        setTeams(userTeamsData.teams)
    }
  }, [userTeamsData])

  if (userTeamsLoading) return <Loading />;
//   const activeFavourites = userTeamsData.userTeams.filter(
//     (pokemon) => pokemon.isActive
//   );

  return (
    <div className="app__favourites">
      {teams === 0 ? (
        <p>Please add some Teams</p>
      ) : (
        <></>
        // <div className="favourites-list">
        //   {teams.map((team, i) => {
        //     const { name, pokemonId } = pokemon.pokemons;
        //     return (
        //       <div
        //         className="favourites-list-item"
        //         key={i}
        //         onClick={() => navigate(`/pokemon/${pokemonId}`)}
        //       >
        //         <p className="favourites-list-item-header">
        //           #{pokemonId} {formatName(name)}
        //         </p>
        //         <img
        //           className="favourite-image"
        //           src={getSprite(pokemonId)}
        //           onError={handleSpriteError}
        //         />
        //       </div>
        //     );
        //   })}
        // </div>
      )}
    </div>
  );
};

export default Teams;

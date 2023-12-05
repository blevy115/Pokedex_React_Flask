import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import { GET_USER_TEAMS } from "../../api/queries/backend";

import {TeamListItem} from "../../components";

import { Loading } from "../../components";

import "./Teams.scss";

const Teams = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [teams, setTeams] = useState([])

  const { data: userTeamsData, loading: userTeamsLoading } = useQuery(
    GET_USER_TEAMS,
    {
      variables: { user_id: user.id },
      client: backEndClient,
    }
  );

  useEffect(() => {
    if (userTeamsData) {
        setTeams(userTeamsData.userTeams)
    }
  }, [userTeamsData])

  if (userTeamsLoading) return <Loading />;

  return (
    <div className="app__teams-list">
      {teams.length === 0 ? (
        <p>Please add some Teams</p>
      ) : (
        teams.map((team, index) => <TeamListItem key={index} team={team}/>)
      )}
    </div>
  );
};

export default Teams;

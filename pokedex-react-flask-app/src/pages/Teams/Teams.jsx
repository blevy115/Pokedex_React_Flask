import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { HiOutlinePlus } from "react-icons/hi2";

import { backEndClient } from "../../api/clients";
import { GET_USER_TEAMS, USER_TEAM_MUTATION } from "../../api/queries/backend";

import { TeamListItem, Loading } from "../../components";

import "./Teams.scss";

const Teams = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);

  async function createTeam() {
    const newTeam = await createUserTeam({
      variables: {
        user_id: user.id,
        name: "New Team",
        pokemons: [],
      },
    });
    const teamId = newTeam.data.mutateTeam.team.teamId;
    navigate(`/teams/${teamId}`);
  }

  const [createUserTeam] = useMutation(USER_TEAM_MUTATION, {
    client: backEndClient,
  });

  const {
    data: userTeamsData,
    loading: userTeamsLoading,
    refetch: refetchUserTeams,
  } = useQuery(GET_USER_TEAMS, {
    variables: { user_id: user.id },
    client: backEndClient,
  });

  useEffect(() => {
    refetchUserTeams({ user_id: user.id });
  }, [user.id, refetchUserTeams]);

  useEffect(() => {
    if (userTeamsData) {
      setTeams(userTeamsData.userTeams);
    }
  }, [userTeamsData]);

  if (userTeamsLoading) return <Loading />;

  return (
    <div className="app__teams-page">
      <h2 className="header-text text-center">{user.name}&#x27;s Teams</h2>
      <div className="new-team-button" onClick={() => createTeam()}>
        <p>Add</p>
        <HiOutlinePlus size={25} />
      </div>
      {teams.length > 0 ? (
        <div className="app__teams-list">
          {teams.map((team, index) => (
            <TeamListItem key={index} team={team} />
          ))}
        </div>
      ) : (
        <p className="text-center">Please add some Teams</p>
      )}
    </div>
  );
};

export default Teams;

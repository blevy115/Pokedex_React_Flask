import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { backEndClient } from "../../api/clients";
import { GET_USER_TEAM } from "../../api/queries/backend";
import { useQuery } from "@apollo/client";
import { getSprite } from "../../helpers/pictures";

import "./TeamEdit.scss";

const TeamEdit = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const params = useParams();
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setselectedTab] = useState(0);

//   console.log(params.teamId);

  const {
    data: teamData,
    loading: teamsLoading,
    error: teamError,
  } = useQuery(GET_USER_TEAM, {
    variables: { user_id: user.id, team_id: params.teamId },
    client: backEndClient,
  });
//   console.log(teamData);
  useEffect(() => {
    if (teamData) {
      const { team } = teamData;
    //   console.log(team.pokemons);
      setTabs(team.pokemons);
      // setselectedTab(team.pokemons[0])
    }
  }, [teamData]);

  const pokemonTabs = useMemo(() =>
    tabs.map(
      (tab, index) => (
        <Tab className="pokemon-tab" key={index}>
          <img
            src={getSprite(tab.pokemon.pokemonId)}
            alt={tab.pokemon.name}
            height="60"
            width="60"
          />
        </Tab>
      ),
      [tabs]
    )
  );

  const pokemonTabPanels = useMemo(() => 
    tabs.map(
        (tab, index) => (
          <TabPanel className="pokemon-tab-panel" key={index}>
            {/* Put Component Here to start displaying and editing Pokmeon*/ }
            <p>{tab.pokemon.name}</p>
          </TabPanel>
        ),
        [tabs]
      )
  )

  if (teamsLoading) return;
  if (teamError)  return (<span className="error">{teamError.message}</span>);

//   console.log(selectedTab);
  console.log(tabs);
  return (
    <div className="pokemon-tabs-container">
      <Tabs
        selectedIndex={selectedTab}
        onSelect={(index) => setselectedTab(index)}
        selectedTabClassName="pokemon-tab--selected"
        selectedTabPanelClassName="pokemon-tab-panel--selected"
      >
        <TabList className="pokemon-tab-list">{pokemonTabs}</TabList>
        {pokemonTabPanels}
      </Tabs>
      {}
      {/* {tabs[selectedTab] ?  : ""} */}
    </div>
  );
};

export default TeamEdit;

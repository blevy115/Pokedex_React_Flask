import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery, useMutation } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import { GET_USER_TEAM, USER_TEAM_MUTATION } from "../../api/queries/backend";

import { TeamPokemonEdit } from "../../components";

import { getSprite } from "../../helpers/pictures";

import "./TeamEdit.scss";

function updateMoves(moves, move, index) {
  const updatedMoves = [];
  for (let i = 0; i < 4; i++) {
    if (moves[i] && moves[i].position === index) {
      updatedMoves.push({
        ...moves[i],
        move: move
          ? {
              name: move.pokemon_v2_move.name,
              moveId: move.pokemon_v2_move.id,
            }
          : null,
      });
    } else if (moves[i]) {
      updatedMoves.push(moves[i]);
    } else {
      updatedMoves.push(null);
    }
  }
  return updatedMoves;
}

const TeamEdit = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const params = useParams();
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setselectedTab] = useState(0);
  const [team, setTeam] = useState({});

  const {
    data: teamData,
    loading: teamsLoading,
    error: teamError,
  } = useQuery(GET_USER_TEAM, {
    variables: { user_id: user.id, team_id: params.teamId },
    client: backEndClient,
  });

  const [updateUserTeam] = useMutation(USER_TEAM_MUTATION, {
    client: backEndClient,
  });

  useEffect(() => {
    if (teamData) {
      const { team } = teamData;
      // TODO maybe fix 2 setState function REPEAT through file
      setTeam(team);
      setTabs(team.pokemons);
    }
  }, [teamData]);

  const changeSelectedPokemon = useCallback(
    (pokemon) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === tabs[selectedTab].position
          ? { ...p, pokemon: { name: pokemon.name, pokemonId: pokemon.id } }
          : p
      );
      setTeam(updatedTeam);
      setTabs(updatedTeam.pokemons);
    },
    [tabs, selectedTab]
  );

  const changeSelectedAbility = useCallback(
    (ability) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === tabs[selectedTab].position
          ? {
              ...p,
              ability: ability
                ? {
                    name: ability.pokemon_v2_ability.name,
                    abilityId: ability.pokemon_v2_ability.id,
                  }
                : null,
            }
          : p
      );
      setTeam(updatedTeam);
      setTabs(updatedTeam.pokemons);
    },
    [tabs, selectedTab]
  );

  const changeSelectedItem = useCallback(
    (item) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === tabs[selectedTab].position
          ? { ...p, item: item ? { name: item.name, itemId: item.id } : null }
          : p
      );
      setTeam(updatedTeam);
      setTabs(updatedTeam.pokemons);
    },
    [tabs, selectedTab]
  );

  const changeSelectedMove = useCallback(
    (move, index) => {
      // TODO Improve this code
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === tabs[selectedTab].position
          ? { ...p, moves: updateMoves(p.moves, move, index) }
          : p
      );
      setTeam(updatedTeam);
      setTabs(updatedTeam.pokemons);
    },
    [tabs, selectedTab]
  );

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
          <TeamPokemonEdit
            changeSelectedPokemon={changeSelectedPokemon}
            changeSelectedMove={changeSelectedMove}
            changeSelectedAbility={changeSelectedAbility}
            changeSelectedItem={changeSelectedItem}
            teamPokemon={tab}
          />
        </TabPanel>
      ),
      [tabs, team]
    )
  );

  const saveTeam = useCallback(
    (team) => {
      const data = {
        user_id: user.id,
        team_id: params.teamId,
        name: team.name,
        pokemons: team.pokemons.map((p) => ({
          ability: p.ability
            ? {
                id: p.ability.abilityId,
                name: p.ability.name,
              }
            : null,
          item: p.item
            ? {
                id: p.item.itemId,
                name: p.item.name,
              }
            : null,
          pokemon: {
            id: p.pokemon.pokemonId,
            name: p.pokemon.name,
          },
          moves: p.moves.map((m) =>
            m.move
              ? {
                  id: m.move.moveId,
                  name: m.move.name,
                  position: m.position,
                }
              : null
          ),
          position: p.position,
        })),
      };
      updateUserTeam({ variables: data });
    },
    [user, params]
  );

  if (teamsLoading) return;
  if (teamError) return <span className="error">{teamError.message}</span>;

  return (
    <>
      <button onClick={() => saveTeam(team)}>Save</button>
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
      </div>
    </>
  );
};

export default TeamEdit;

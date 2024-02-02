import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery, useMutation } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import {
  GET_USER_TEAM,
  GET_NATURES,
  GET_TYPES,
  USER_TEAM_MUTATION,
} from "../../api/queries/backend";

import { TeamPokemonEdit } from "../../components";

import { getSprite } from "../../helpers/pictures";
import {
  convertStats,
  calculateTeamPokemonStats,
} from "../../helpers/statModifier";

import "./TeamEdit.scss";

const initialState = [0, 0, 0, 0, 0, 0];

const newPokemon = (position) => ({
  pokemon: null,
  ability: null,
  moves: [],
  item: null,
  nature: null,
  teraType: null,
  position,
});

const modifyPokemonData = (p) => ({
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
  pokemon: p.pokemon
    ? {
        id: p.pokemon.pokemonId,
        name: p.pokemon.name,
        types: p.pokemon.types
          ? p.pokemon.types
          : p.pokemon.type2Id
          ? [p.pokemon.type1Id, p.pokemon.type2Id]
          : [p.pokemon.type1Id],
        baseStats: p.pokemon.baseStats,
      }
    : null,
  moves: p.moves.map((m) =>
    m.move
      ? {
          id: m.move.moveId,
          name: m.move.name,
          position: m.position,
          typeId: m.move.typeId,
        }
      : null
  ),
  nature: p.nature
    ? {
        id: p.nature.natureId,
        name: p.nature.name,
      }
    : null,
  teraType: p.teraType
    ? {
        id: p.teraType.typeId,
        name: p.teraType.name,
      }
    : null,
  ivs: p.ivs ? [...p.ivs] : initialState,
  evs: p.evs ? [...p.evs] : initialState,
  stats: p.pokemon?.baseStats ? calculateTeamPokemonStats(p) : initialState,
  level: p.level,
  position: p.position,
});

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
              typeId: move.pokemon_v2_move.type.id,
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
  const [team, setTeam] = useState({ pokemons: [] });
  const [name, setName] = useState("");
  const [selectedTab, setselectedTab] = useState(0);

  const {
    data: teamData,
    loading: teamsLoading,
    error: teamError,
    refetch: refetchTeamData,
  } = useQuery(GET_USER_TEAM, {
    variables: { user_id: user.id, team_id: params.teamId },
    client: backEndClient,
  });

  const [updateUserTeam] = useMutation(USER_TEAM_MUTATION, {
    client: backEndClient,
  });

  const { data: natureData } = useQuery(GET_NATURES, {
    client: backEndClient,
  });

  const { data: typeData } = useQuery(GET_TYPES, {
    client: backEndClient,
  });

  useEffect(() => {
    if (teamData) {
      const { team } = teamData;
      // TODO maybe fix 2 setState function REPEAT through file
      setName(team.name);
      setTeam(team);
    }
  }, [teamData]);

  useEffect(() => {
    refetchTeamData({ user_id: user.id, team_id: params.teamId });
  }, [user.id, params.teamId, refetchTeamData]);

  const changeSelectedPokemon = useCallback(
    (pokemon) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? {
              ...p,
              pokemon: {
                name: pokemon.name,
                pokemonId: pokemon.id,
                types: pokemon.types.map((t) => t.pokemon_v2_type.id),
                baseStats: Object.values(convertStats(pokemon.stats)),
              },
            }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeSelectedAbility = useCallback(
    (ability) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
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
    },
    [team, selectedTab]
  );

  const changeSelectedItem = useCallback(
    (item) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? { ...p, item: item ? { name: item.name, itemId: item.id } : null }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeSelectedNature = useCallback(
    (nature) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? {
              ...p,
              nature: nature
                ? {
                    name: nature.name,
                    natureId: nature.natureId,
                    increasedStat: nature.increasedStat,
                    decreasedStat: nature.decreasedStat,
                  }
                : null,
            }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeSelectedTeraType = useCallback(
    (teraType) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? {
              ...p,
              teraType: teraType
                ? { name: teraType.name, typeId: teraType.typeId }
                : null,
            }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeSelectedMove = useCallback(
    (move, index) => {
      // TODO Improve this code
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? { ...p, moves: updateMoves(p.moves, move, index) }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeIvs = useCallback(
    (index, value) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? {
              ...p,
              ivs:
                value || value === 0
                  ? [...p.ivs.slice(0, index), value, ...p.ivs.slice(index + 1)]
                  : initialState,
            }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeEvs = useCallback(
    (index, value) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? {
              ...p,
              evs:
                value || value === 0
                  ? [
                      ...p.evs.slice(0, index),
                      value,
                      ...p.evs.slice(index + 1),
                    ].reduce((acc, curr) => acc + curr, 0) <= 510
                    ? [
                        ...p.evs.slice(0, index),
                        value,
                        ...p.evs.slice(index + 1),
                      ]
                    : [...p.evs]
                  : initialState,
            }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const changeLevel = useCallback(
    (level) => {
      const updatedTeam = { ...team };
      updatedTeam.pokemons = updatedTeam.pokemons.map((p) =>
        p.position === team.pokemons[selectedTab].position
          ? {
              ...p,
              level: level,
            }
          : p
      );
      setTeam(updatedTeam);
    },
    [team, selectedTab]
  );

  const pokemonTabs = useMemo(() =>
    team.pokemons.map(
      (tab, index) => (
        <Tab className="pokemon-tab" key={index}>
          <img
            src={getSprite(tab.pokemon?.pokemonId)}
            alt={tab.pokemon?.name}
            height="60"
            width="60"
          />
        </Tab>
      ),
      [team]
    )
  );

  const pokemonTabPanels = useMemo(() =>
    team.pokemons.map(
      (tab, index) => (
        <TabPanel className="pokemon-tab-panel" key={index}>
          <TeamPokemonEdit
            changeSelectedPokemon={changeSelectedPokemon}
            changeSelectedMove={changeSelectedMove}
            changeSelectedAbility={changeSelectedAbility}
            changeSelectedItem={changeSelectedItem}
            changeSelectedNature={changeSelectedNature}
            changeSelectedTeraType={changeSelectedTeraType}
            changeIvs={changeIvs}
            changeEvs={changeEvs}
            changeLevel={changeLevel}
            teamPokemon={tab}
            natureData={natureData}
            typeData={typeData}
          />
        </TabPanel>
      ),
      [team]
    )
  );

  const newPokemonTab = useMemo(
    () => (
      <Tab disabled className="pokemon-tab add" key={team.pokemons.length}>
        <button
          onClick={async () => {
            const data = {
              user_id: user.id,
              team_id: params.teamId,
              name: name,
              pokemons: team.pokemons
                ? [
                    ...team.pokemons.map((p) => modifyPokemonData(p)),
                    newPokemon(team.pokemons?.length + 1),
                  ]
                : [],
            };
            await updateUserTeam({ variables: data });
            refetchTeamData();
          }}
        >
          Add
        </button>
      </Tab>
    ),
    [team, name]
  );

  const newPokemonTabPanel = useMemo(
    () => (
      <TabPanel className="pokemon-tab-panel" key={team.pokemons.length}>
        <></>
      </TabPanel>
    ),
    [team]
  );

  const saveTeam = useCallback(
    (team) => {
      const data = {
        user_id: user.id,
        team_id: params.teamId,
        name: name,
        pokemons: team.pokemons.map((p) => modifyPokemonData(p)),
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
      <input
        id="team-name"
        type="text"
        autoComplete="off"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="pokemon-tabs-container">
        <Tabs
          selectedIndex={selectedTab}
          onSelect={(index) => setselectedTab(index)}
          selectedTabClassName="pokemon-tab--selected"
          selectedTabPanelClassName="pokemon-tab-panel--selected"
        >
          <TabList className="pokemon-tab-list">
            {pokemonTabs.length <= 5
              ? pokemonTabs.concat(newPokemonTab)
              : pokemonTabs}
          </TabList>
          {pokemonTabPanels.length <= 5
            ? pokemonTabPanels.concat(newPokemonTabPanel)
            : pokemonTabPanels}
        </Tabs>
      </div>
    </>
  );
};

export default TeamEdit;

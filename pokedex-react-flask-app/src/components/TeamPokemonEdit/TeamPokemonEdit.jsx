import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { useQuery } from "@apollo/client";

import { pokemonAPIClient } from "../../api/clients";

import {
  GET_POKEMON_LIST_BY_NAME,
  GET_POKEMON_LIST_BY_ID,
  GET_TEAM_POKEMON_INFO,
} from "../../api/queries/pokeapi";

import { Loading, DebouncedInput } from "../../components";

import { formatName } from "../../helpers/format";

import "./TeamPokemonEdit.scss";
import { calculateTeamPokemonStats } from "../../helpers/statModifier";

const labels = [
  "hp",
  "attack",
  "defense",
  "speed",
  "special-defense",
  "special-attack",
];

const SliderGroup = ({ savedIvs, savedEvs, changeIvs, changeEvs }) => {
  const handleInputChange = (group, index, inputValue) => {
    const parsedValue = parseInt(inputValue, 10) || 0;
    const clampedValue = Math.min(
      group === "ivs" ? 31 : 252,
      Math.max(0, parsedValue)
    );

    if (group === "ivs") {
      changeIvs(index, clampedValue);
    } else {
      changeEvs(index, clampedValue);
    }
  };

  return (
    <div className="stats-slider-container">
      <div className="stats-slider">
        <h2>IVs</h2>
        {savedIvs.map((value, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <label className="stat-slider-label">
              {formatName(labels[index])}
            </label>
            <Slider
              min={0}
              max={31}
              value={value}
              onChange={(newValue) => changeIvs(index, newValue)}
            />
            <input
              type="text"
              value={Number(savedIvs[index]).toString()}
              onChange={(e) => handleInputChange("ivs", index, e.target.value)}
              style={{ width: "50px", marginLeft: "10px" }}
            />
          </div>
        ))}
        <button onClick={() => changeIvs(null, null)}>Clear</button>
      </div>
      <div className="stats-slider">
        <h2>EVs</h2>
        {savedEvs.map((value, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <label className="stat-slider-label">
              {formatName(labels[index])}
            </label>
            <Slider
              min={0}
              max={252}
              value={value}
              onChange={(newValue) => changeEvs(index, newValue)}
            />
            <input
              type="text"
              value={Number(savedEvs[index]).toString()}
              onChange={(e) => handleInputChange("evs", index, e.target.value)}
              style={{ width: "50px", marginLeft: "10px" }}
            />
          </div>
        ))}
        <button onClick={() => changeEvs(null, null)}>Clear</button>
      </div>
    </div>
  );
};

function getSelectedMove(movesList, selectedMoves, i) {
  const selectedMove = selectedMoves.find(
    (move) => move.position === i && move.move !== null
  );
  if (selectedMove) {
    const moveIsLearnable = movesList.find(
      (move) => move.pokemon_v2_move.id === selectedMove.move.moveId
    );
    if (moveIsLearnable) {
      return moveIsLearnable.pokemon_v2_move.id;
    }
  } else {
    return "";
  }
}

function getSelectedAbility(abilitiesList, selectedAbility) {
  if (selectedAbility) {
    const abilityIsLearnable = abilitiesList.find(
      (ability) => ability.pokemon_v2_ability.id === selectedAbility.abilityId
    );
    if (abilityIsLearnable) {
      return abilityIsLearnable.pokemon_v2_ability.id;
    }
  } else {
    return "";
  }
}

function getSelectedItem(itemsList, selectedItem) {
  if (selectedItem) {
    const itemIsLearnable = itemsList.find(
      (item) => item.id === selectedItem.itemId
    );
    if (itemIsLearnable) {
      return itemIsLearnable.id;
    }
  } else {
    return "";
  }
}

const TeamPokemonEdit = ({
  teamPokemon,
  natureData,
  typeData,
  changeSelectedPokemon,
  changeSelectedMove,
  changeSelectedAbility,
  changeSelectedItem,
  changeSelectedNature,
  changeSelectedTeraType,
  changeIvs,
  changeEvs,
  changeLevel,
}) => {
  const [textInput, setTextInput] = useState("");
  const [selectedMoves, setSelectedMoves] = useState(teamPokemon.moves);
  const [selectedAbility, setSelectedAbility] = useState(teamPokemon.ability);
  const [selectedItem, setSelectedItem] = useState(teamPokemon.item);
  const [selectedNature, setselectedNature] = useState(teamPokemon.nature);
  const [selectedTeraType, setselectedTeraType] = useState(
    teamPokemon.teraType
  );
  const [level, setLevel] = useState(teamPokemon.level);
  const [ivs, setIvs] = useState(teamPokemon.ivs);
  const [evs, setEvs] = useState(teamPokemon.evs);

  useEffect(() => {
    setTextInput("")
    setSelectedMoves(teamPokemon.moves);
    setSelectedAbility(teamPokemon.ability);
    setSelectedItem(teamPokemon.item);
    setselectedNature(teamPokemon.nature);
    setselectedTeraType(teamPokemon.teraType);
    setIvs(teamPokemon.ivs);
    setEvs(teamPokemon.evs);
    setLevel(teamPokemon.level);
  }, [teamPokemon]);

  const { data: list, loading: loadingList } = useQuery(
    !parseInt(textInput) ? GET_POKEMON_LIST_BY_NAME : GET_POKEMON_LIST_BY_ID,
    {
      variables: !parseInt(textInput)
        ? { name: `%${textInput.replaceAll(" ", "-")}%` }
        : { id: parseInt(textInput) },
      skip: !textInput,
      client: pokemonAPIClient,
    }
  );

  const { data: pokemonData } = useQuery(GET_TEAM_POKEMON_INFO, {
    variables: { id: parseInt(teamPokemon.pokemon?.pokemonId) },
    client: pokemonAPIClient,
    skip: !teamPokemon.pokemon,
  });

  const handlePokemonSelection = (selectedPokemon) => {
    changeSelectedPokemon(selectedPokemon);
  };

  const movesList = pokemonData
    ? [...pokemonData.pokemon_details[0].moves].sort((a, b) =>
        a.pokemon_v2_move.name.localeCompare(b.pokemon_v2_move.name)
      )
    : null;

  const abilitiesList = pokemonData
    ? [
        ...pokemonData.pokemon_details[0].abilities.map((a) =>
          a.is_hidden
            ? {
                ...a,
                pokemon_v2_ability: {
                  ...a.pokemon_v2_ability,
                  name: `${a.pokemon_v2_ability.name} (H)`,
                },
              }
            : a
        ),
      ]
    : null;

  const itemsList = pokemonData
    ? [...pokemonData.items].sort((a, b) => a.name.localeCompare(b.name))
    : null;

  const naturesList = natureData.natures;

  const typesList = typeData.types;

  return (
    <div className="app__team-pokemon">
      <div className="pokemon-search">
        <DebouncedInput
          id="app__pokemon-search-field"
          onValueChange={setTextInput}
          placeholder="Pokemon"
          debouceTime={400}
          label="Pokemon"
          initialValue={
            teamPokemon.pokemon ? formatName(teamPokemon.pokemon.name) : ""
          }
        />
        {loadingList && <Loading fullscreen={false} />}
        <div>
          {list &&
            list.pokemon_list.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => handlePokemonSelection(pokemon)}
                style={{ cursor: "pointer" }}
              >
                {pokemon.name}
              </div>
            ))}
        </div>
      </div>
      {pokemonData ? (
        <>
          <div className="level-select">
            <div>
              <label htmlFor="level">Level</label>
              <select
                name="level"
                onChange={(e) => changeLevel(parseInt(e.target.value))}
                value={level}
              >
                {Array.from({ length: 100 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="moves-search">
            <div>
              <label htmlFor="move-1">Move 1</label>
              <select
                name="move-1"
                onChange={(e) =>
                  changeSelectedMove(
                    movesList.find(
                      (move) => move.pokemon_v2_move.id == e.target.value
                    ),
                    1
                  )
                }
                value={getSelectedMove(movesList, selectedMoves, 1)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
                      selectedMove.move &&
                      selectedMove.move &&
                      selectedMove.move.moveId === move.pokemon_v2_move.id
                  );
                  return (
                    <option
                      key={move.pokemon_v2_move.id}
                      value={move.pokemon_v2_move.id}
                      disabled={isSelected}
                    >
                      {formatName(move.pokemon_v2_move.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="move-2">Move 2</label>
              <select
                name="move-2"
                onChange={(e) =>
                  changeSelectedMove(
                    movesList.find(
                      (move) => move.pokemon_v2_move.id == e.target.value
                    ),
                    2
                  )
                }
                value={getSelectedMove(movesList, selectedMoves, 2)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
                      selectedMove.move &&
                      selectedMove.move.moveId === move.pokemon_v2_move.id
                  );
                  return (
                    <option
                      key={move.pokemon_v2_move.id}
                      value={move.pokemon_v2_move.id}
                      disabled={isSelected}
                    >
                      {formatName(move.pokemon_v2_move.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="move-3">Move 3</label>
              <select
                name="move-3"
                onChange={(e) =>
                  changeSelectedMove(
                    movesList.find(
                      (move) => move.pokemon_v2_move.id == e.target.value
                    ),
                    3
                  )
                }
                value={getSelectedMove(movesList, selectedMoves, 3)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
                      selectedMove.move &&
                      selectedMove.move.moveId === move.pokemon_v2_move.id
                  );
                  return (
                    <option
                      key={move.pokemon_v2_move.id}
                      value={move.pokemon_v2_move.id}
                      disabled={isSelected}
                    >
                      {formatName(move.pokemon_v2_move.name)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="move-4">Move 4</label>
              <select
                name="move-4"
                onChange={(e) =>
                  changeSelectedMove(
                    movesList.find(
                      (move) => move.pokemon_v2_move.id == e.target.value
                    ),
                    4
                  )
                }
                value={getSelectedMove(movesList, selectedMoves, 4)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
                      selectedMove.move &&
                      selectedMove.move.moveId === move.pokemon_v2_move.id
                  );
                  return (
                    <option
                      key={move.pokemon_v2_move.id}
                      value={move.pokemon_v2_move.id}
                      disabled={isSelected}
                    >
                      {formatName(move.pokemon_v2_move.name)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="ability-search">
            <div>
              <label htmlFor="abilty">Abilty</label>
              <select
                name="abilty"
                onChange={(e) =>
                  changeSelectedAbility(
                    abilitiesList.find(
                      (ability) =>
                        ability.pokemon_v2_ability.id == e.target.value
                    )
                  )
                }
                value={getSelectedAbility(abilitiesList, selectedAbility)}
              >
                <option value={null}>Select Ability</option>
                {abilitiesList.map((ability) => (
                  <option
                    key={ability.pokemon_v2_ability.id}
                    value={ability.pokemon_v2_ability.id}
                  >
                    {formatName(ability.pokemon_v2_ability.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="item-search">
            <div>
              <label htmlFor="item">Item</label>
              <select
                name="item"
                onChange={(e) =>
                  changeSelectedItem(
                    itemsList.find((item) => item.id == e.target.value)
                  )
                }
                value={getSelectedItem(itemsList, selectedItem)}
              >
                <option value={null}>Select Item</option>
                {itemsList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {formatName(item.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="nature-select">
            <div>
              <label htmlFor="nature">Nature</label>
              <select
                name="nature"
                onChange={(e) =>
                  changeSelectedNature(
                    naturesList.find(
                      (nature) => nature.natureId == e.target.value
                    )
                  )
                }
                value={selectedNature ? selectedNature.natureId : ""}
              >
                <option value={null}>Select Nature</option>
                {naturesList.map((nature) => (
                  <option key={nature.natureId} value={nature.natureId}>
                    {formatName(nature.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="tera-type-select">
            <div>
              <label htmlFor="tera-type">Tera Type</label>
              <select
                name="tera-type"
                onChange={(e) =>
                  changeSelectedTeraType(
                    typesList.find((type) => type.typeId == e.target.value)
                  )
                }
                value={selectedTeraType ? selectedTeraType.typeId : ""}
              >
                <option value={null}>Select Type</option>
                {typesList.map((type) => (
                  <option key={type.typeId} value={type.typeId}>
                    {formatName(type.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="text-center">Base Stats</p>
            <div className="base-stat-container">
              {teamPokemon.pokemon.baseStats.map((stat, index) => (
                <p key={`${teamPokemon.position}-${index}`}>
                  {formatName(labels[index])}: {stat}
                </p>
              ))}
            </div>
          </div>
          <SliderGroup
            savedIvs={ivs}
            savedEvs={evs}
            changeIvs={changeIvs}
            changeEvs={changeEvs}
          />
          <div>
            <p className="text-center">Calculated Stats</p>
            <div className="base-stat-container">
              {calculateTeamPokemonStats(teamPokemon).map((stat, index) => (
                <p
                  className={
                    !teamPokemon.nature
                      ? ""
                      : labels[index] === teamPokemon.nature.increasedStat
                      ? "increased"
                      : labels[index] === teamPokemon.nature.decreasedStat
                      ? "decreased"
                      : ""
                  }
                  key={`${teamPokemon.position}-${index}-c`}
                >
                  {formatName(labels[index])}: {stat}
                </p>
              ))}
            </div>
          </div>
          {/* <StatChart baseStats={teamPokemon.stats} isAFavourite={true} /> */}
        </>
      ) : null}
    </div>
  );
};

export default TeamPokemonEdit;

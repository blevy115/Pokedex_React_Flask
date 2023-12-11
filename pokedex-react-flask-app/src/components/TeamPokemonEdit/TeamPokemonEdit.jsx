import React, { useEffect, useState } from "react";
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
    return null;
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
    return null;
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
    return null;
  }
}

const TeamPokemonEdit = ({
  teamPokemon,
  changeSelectedPokemon,
  changeSelectedMove,
  changeSelectedAbility,
  changeSelectedItem,
}) => {
  const [textInput, setTextInput] = useState("");
  const [selectedMoves, setSelectedMoves] = useState(teamPokemon.moves);
  const [selectedAbility, setSelectedAbility] = useState(teamPokemon.ability);
  const [selectedItem, setSelectedItem] = useState(teamPokemon.item);

  useEffect(() => {
    setSelectedMoves(teamPokemon.moves);
    setSelectedAbility(teamPokemon.ability);
    setSelectedItem(teamPokemon.item);
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
    variables: { id: parseInt(teamPokemon.pokemon.pokemonId) },
    client: pokemonAPIClient,
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

    return (
    <div className="app__team-pokemon">
      <div className="pokemon-search">
        <DebouncedInput
          id="app__pokemon-search-field"
          onValueChange={setTextInput}
          placeholder="Pokemon"
          debouceTime={400}
          label="Pokemon"
          initialValue={formatName(teamPokemon.pokemon.name)}
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
                defaultValue={getSelectedMove(movesList, selectedMoves, 1)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
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
                defaultValue={getSelectedMove(movesList, selectedMoves, 2)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
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
                defaultValue={getSelectedMove(movesList, selectedMoves, 3)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
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
                defaultValue={getSelectedMove(movesList, selectedMoves, 4)}
              >
                <option value={null}>Select Move</option>
                {movesList.map((move) => {
                  const isSelected = selectedMoves.some(
                    (selectedMove) =>
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
                defaultValue={getSelectedAbility(
                  abilitiesList,
                  selectedAbility
                )}
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
                defaultValue={getSelectedItem(itemsList, selectedItem)}
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
        </>
      ) : null}
    </div>
  );
};

export default TeamPokemonEdit;

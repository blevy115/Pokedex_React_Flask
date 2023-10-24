import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

import { sortPokemonByEggGroups } from "../../helpers/sortPokemonByEggGroups";
import { modifyEggGroupPokemon } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";
import { eggGroupNameHelper } from "../../helpers/eggGroupNamehelper";

import { Table } from "../";
import {
  SpriteComponent,
  PokemonNameComponent,
  TypesImageComponent,
  EggGroupsComponent,
} from "../TableCellComponents/TableCellComponents";

import "./EggGroupPokemon.scss";

const EggGroupPokemon = ({ name, list, eggGroupId }) => {
  const [byEggGroup, setbyEggGroup] = useState();

  const eggGroupBarRefs = useRef(null);
  const secondaryEggGroupTableRefsList = useRef([]);
  const secondaryEggGroupTables = useRef(null);

  const isInView = useInView(secondaryEggGroupTables);
  useEffect(() => {
    setbyEggGroup(false);
  }, [eggGroupId]);

  const sortedPokemonData = useMemo(
    () =>
      sortPokemonByEggGroups({ pokemons: list, id: eggGroupId, byEggGroup }),
    [list, byEggGroup]
  );
  const { 0: pure, ...semi } = sortedPokemonData;

  const scrollToEggGroupTable = (index) => {
    secondaryEggGroupTableRefsList.current[index].scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToEggGroups = () => {
    eggGroupBarRefs.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const { tableData: pureTableData, columns: pureColumns } =
    modifyEggGroupPokemon({
      pokemons: pure.pokemons,
      SpriteComponent,
      NameComponent: PokemonNameComponent,
      TypesImageComponent,
    });

  const modifiedSemiData = Object.values(semi).map((group) => {
    return {
      data: modifyEggGroupPokemon({
        pokemons: group.pokemons,
        SpriteComponent,
        NameComponent: PokemonNameComponent,
        EggGroupsComponent,
        TypesImageComponent,
        pageId: eggGroupId,
        hasEggGroup: true,
      }),
      name: group.egg_group_name,
    };
  });

  const hasMultiGroupPokemon =
    (!byEggGroup && semi[1].pokemons.length > 0) ||
    (byEggGroup && Object.keys(semi).length > 0);
  return (
    <div>
      <h4 className="pure-pokemon-table-header">
        Pure {formatName(name)} Pokemon
      </h4>
      <Table data={pureTableData} columns={pureColumns} />
      {hasMultiGroupPokemon ? (
        <>
          <button
            ref={eggGroupBarRefs}
            className="sort-egg-groups-bar-button clickable"
            onClick={() => {
              setbyEggGroup(!byEggGroup);
            }}
          >
            Sort by {byEggGroup ? "ID" : "Egg Group"}
          </button>
          <div className="sort-egg-groups-bar-list">
            {byEggGroup &&
              modifiedSemiData.map(({ name }, i) => (
                <div className="egg-group-icon-container" key={name}>
                  <img
                    src={`/icons/egg-groups/${eggGroupNameHelper(name)}.png`}
                    alt={`${eggGroupNameHelper(name)} egg group`}
                    onClick={() => scrollToEggGroupTable(i)}
                    className="egg-group-icon clickable"
                  />
                  <p>{`${formatName(eggGroupNameHelper(name))}`}</p>
                </div>
              ))}
          </div>
          <AnimatePresence>
            {isInView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p
                  className="scroll-to-top-button"
                  onClick={() => scrollToEggGroups()}
                >
                  Egg Groups
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={secondaryEggGroupTables}>
            {modifiedSemiData.map(
              ({ data: { columns, tableData }, name: eggGroupName }, i) => (
                <div
                  key={eggGroupName}
                  ref={(el) => (secondaryEggGroupTableRefsList.current[i] = el)}
                >
                  <h4>
                    {eggGroupName === "half"
                      ? `Half ${formatName(name)}`
                      : `${formatName(
                          eggGroupNameHelper(eggGroupName)
                        )}-${formatName(name)}`}{" "}
                    Pokemon
                  </h4>
                  <Table data={tableData} columns={columns} />
                </div>
              )
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default EggGroupPokemon;

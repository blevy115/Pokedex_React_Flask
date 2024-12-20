import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

import { sortPokemonByTypes } from "../../helpers/sortPokemonByTypes";
import { modifyPokemon } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";

import { Table } from "../";
import {
  SpriteComponent,
  PokemonNameComponent,
  TypesImageComponent,
} from "../TableCellComponents/TableCellComponents";

import "./TypePokemon.scss";

const TypePokemon = ({ name, list, typeId, generationId, onlySelectedGen }) => {
  const [byType, setbyType] = useState();
  const [tableExtended, setTableExtended] = useState(false);

  const typeBarRefs = useRef(null);
  const secondaryTypeTableRefsList = useRef([]);
  const secondaryTypeTables = useRef(null);

  const isInView = useInView(secondaryTypeTables);

  useEffect(() => {
    setbyType(false);
  }, [typeId]);

  const filteredPokemon = useMemo(() => {
    if (generationId === "All") return list;
    return list.filter((pokemon) => {
      const gen =
        pokemon.pokemon_v2_pokemon.pokemon_v2_pokemonforms[0]
          .pokemon_v2_versiongroup.generation_id;
      const isWithinGen = gen <= generationId;
      const isExactGen = gen === generationId;
      return onlySelectedGen ? isExactGen : isWithinGen;
    });
  }, [list, generationId, onlySelectedGen]);

  const sortedPokemonData = useMemo(
    () => sortPokemonByTypes({ pokemons: filteredPokemon, id: typeId, byType }),
    [filteredPokemon, byType]
  );
  const { 0: pure, ...semi } = sortedPokemonData;

  const scrollToTypeTable = (index) => {
    secondaryTypeTableRefsList.current[index].scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToTypes = () => {
    typeBarRefs.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const { tableData: pureTableData, columns: pureColumns } = modifyPokemon({
    pokemons: pure.pokemons,
    SpriteComponent,
    NameComponent: PokemonNameComponent,
    hasType: false,
    hasGeneration: !onlySelectedGen,
    hasStats: tableExtended,
  });

  const modifiedSemiData = Object.values(semi).map((group) => {
    return {
      data: modifyPokemon({
        pokemons: group.pokemons,
        SpriteComponent,
        NameComponent: PokemonNameComponent,
        TypesImageComponent,
        pageId: typeId,
        hasGeneration: !onlySelectedGen,
        hasStats: tableExtended,
      }),
      name: group.type_name,
    };
  });

  return (
    <div>
      <div className="checkbox-input">
        <label htmlFor="ExtendTable">
          Show Stats
          <input
            id="ExtendTable"
            type="checkbox"
            className="clickable"
            checked={tableExtended}
            onChange={(e) => setTableExtended(e.target.checked)}
          />
        </label>
      </div>
      <h4 className="pure-pokemon-table-header">
        Pure {formatName(name)} Pokemon
      </h4>
      <Table data={pureTableData} columns={pureColumns} />
      <button
        ref={typeBarRefs}
        className="sort-types-bar-button clickable"
        onClick={() => {
          setbyType(!byType);
        }}
      >
        Sort by {byType ? "ID" : "Type"}
      </button>
      <div className="sort-types-bar-list">
        {byType &&
          modifiedSemiData.map(({ name }, i) => (
            <img
              key={name}
              src={`/icons/symbols/${name}.png`}
              alt={`${name} symbol`}
              onClick={() => scrollToTypeTable(i)}
              className="type-icon clickable"
            />
          ))}
      </div>
      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="scroll-to-top-button" onClick={() => scrollToTypes()}>
              Types
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={secondaryTypeTables}>
        {modifiedSemiData.map(
          ({ data: { columns, tableData }, name: typeName }, i) => (
            <div
              key={typeName}
              className="secondary-type-table"
              ref={(el) => (secondaryTypeTableRefsList.current[i] = el)}
            >
              <h4>
                {typeName === "half"
                  ? `Half ${formatName(name)}`
                  : `${formatName(typeName)}-${formatName(name)}`}{" "}
                Pokemon
              </h4>
              <Table data={tableData} columns={columns} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TypePokemon;

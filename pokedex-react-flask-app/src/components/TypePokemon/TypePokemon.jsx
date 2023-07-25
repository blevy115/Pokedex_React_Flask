import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";

import { sortPokemonByTypes } from "../../helpers/sortPokemonByTypes";
import { handleSpriteError } from "../../helpers/error";
import { getSprite } from "../../helpers/pictures";
import { modifyPokemon } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";

import { Types, Table } from "../";

import "./TypePokemon.scss";

const TypePokemon = ({ name, list, typeId }) => {
  const navigate = useNavigate();
  const [byType, setbyType] = useState();

  const elementsRefs = useRef([]);
  const typeBarRefs = useRef(null);
  const secondaryTypeTables = useRef(null);

  const isInView = useInView(secondaryTypeTables);

  useEffect(() => {
    setbyType(false);
  }, [typeId]);

  const sortedPokemonData = useMemo(
    () => sortPokemonByTypes({ pokemons: list, id: typeId, byType }),
    [list, byType]
  );
  const { 0: pure, ...semi } = sortedPokemonData;

  const scrollToElement = (index) => {
    elementsRefs.current[index].scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToTypes = () => {
    typeBarRefs.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const SpriteComponent = ({ value }) => {
    return (
      <img
        className="pokemon-list-item-sprite clickable"
        onError={handleSpriteError}
        src={getSprite(value)}
        onClick={() => navigate(`/pokemon/${value}`)}
      />
    );
  };

  const NameComponent = ({ value, row }) => {
    return (
      <p
        className="pokemon-list-item-name clickable"
        onClick={() => navigate(`/pokemon/${row.original.spriteId}`)}
      >
        {formatName(value)}
      </p>
    );
  };

  const TypesImageComponent = ({ value }) => {
    return <Types types={value} />;
  };

  const { tableData: pureTableData, columns: pureColumns } = modifyPokemon({
    pokemons: pure.pokemons,
    SpriteComponent,
    NameComponent,
    TypesImageComponent,
  });

  const modifiedSemiData = Object.values(semi).map((group) => {
    return {
      data: modifyPokemon({
        pokemons: group.pokemons,
        SpriteComponent,
        NameComponent,
        TypesImageComponent,
      }),
      name: group.type_name,
    };
  });

  return (
    <div>
      <h4>Pure {name} Pokemon</h4>
      <Table data={pureTableData} columns={pureColumns} />
      <div ref={typeBarRefs} className="sort-types-bar-container">
        <button
          className="clickable"
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
                onClick={() => scrollToElement(i)}
                className="type-icon clickable"
              />
            ))}
        </div>
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
            <div key={typeName} ref={(el) => (elementsRefs.current[i] = el)}>
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

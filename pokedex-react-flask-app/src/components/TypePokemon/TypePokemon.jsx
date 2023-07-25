import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { sortPokemonByTypes } from "../../helpers/sortPokemonByTypes";
import { handleImageError } from "../../helpers/error";
import { getSprite } from "../../helpers/pictures";
import { modifyPokemon } from "../../helpers/modifyForTable";
import { formatName } from "../../helpers/format";

import { Types, Table } from "../";

import "./TypePokemon.scss";

const TypePokemon = ({ name, list, typeId }) => {
  const navigate = useNavigate();
  const [byType, setbyType] = useState();

  useEffect(() => {
    setbyType(false);
  }, [typeId]);

  const sortedPokemonData = useMemo(
    () => sortPokemonByTypes({ pokemons: list, id: typeId, byType }),
    [list, byType]
  );
  const { 0: pure, ...semi } = sortedPokemonData;

  const SpriteComponent = ({ value }) => {
    return (
      <img
        className="pokemon-list-item-sprite clickable"
        onError={handleImageError}
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
      <button
        onClick={() => {
          setbyType(!byType);
        }}
      >
        Sort by {byType ? "ID" : "Type"}
      </button>
      {modifiedSemiData.map(
        ({ data: { columns, tableData }, name: typeName }) => (
          <div key={typeName}>
            <h4>{typeName === "half" ? `Half ${name}` : typeName} Pokemon</h4>
            <Table data={tableData} columns={columns} />
          </div>
        )
      )}
    </div>
  );
};

export default TypePokemon;

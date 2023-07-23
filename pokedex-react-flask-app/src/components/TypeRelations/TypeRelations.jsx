import React from "react";
import { useNavigate } from "react-router-dom";

import all_types from "../../data/all_types.json";

import { getTypeId } from "../../helpers/getTypeId";
import { formatName } from "../../helpers/format";

import "./TypeRelations.scss";

const TypeRelations = ({ type }) => {
  const navigate = useNavigate();
  const { attack, defense } = all_types[type];

  const TypeRelationsComponent = ({ relations }) => (
    <div className="type-effectiveness-relation-container">
      {relations.map(([relation, types]) => (
        <div className="type-effectiveness-relation" key={relation}>
          <p>{formatName(relation)}</p>
          {types.length > 0 ? (
            <div className="type-effectiveness-relations-list">
              {types.map((type) => (
                <img
                  className="type-effectiveness-relations-item clickable"
                  onClick={() => navigate(`/types/${getTypeId(type)}`)}
                  key={getTypeId(type)}
                  src={`/icons/types/${type}.png`}
                  alt={`${type} icon`}
                />
              ))}
            </div>
          ) : (
            <p>None</p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="type-effectiveness-container">
      <div className="type-effectiveness-offense">
        <p className="text-center">Attack</p>
        <TypeRelationsComponent relations={Object.entries(attack)} />
      </div>
      <div className="type-effectiveness-defense">
        <p className="text-center">Defense</p>
        <TypeRelationsComponent relations={Object.entries(defense)} />
      </div>
    </div>
  );
};

export default TypeRelations;

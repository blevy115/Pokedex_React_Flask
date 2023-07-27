import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { v4 as uuidv4 } from "uuid";

import { formatName } from "../../helpers/format";

import "./Abilities.scss";

const Abilities = ({ abilities }) => {
  const navigate = useNavigate();

  return (
    <div className="app__abilities">
      <h4 className="text-center">Abilities</h4>
      <ol className="abilities-list">
        {abilities.map((ability, i) => {
          const tooltipId = uuidv4();
          const hasAbilityText = ability.pokemon_v2_ability.text.length > 0;
          const popupText = hasAbilityText
            ? ability.pokemon_v2_ability.text[0].short_effect
            : null;
          return (
            <li
              key={i}
              className="clickable no-wrap"
              data-tip
              data-tooltip-id={tooltipId}
            >
              {ability.is_hidden && " (H) "}
              {formatName(ability.pokemon_v2_ability.name)}
              <Tooltip
                id={tooltipId}
                effect="solid"
                arrowColor="#fff"
                className="skills-tooltip"
                clickable
                openOnClick
                opacity={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  cursor: "default",
                }}
              >
                {popupText || "No Flavor Text Found"}
                <button
                  className="popup-button"
                  onClick={() =>
                    navigate(`/abilities/${ability.pokemon_v2_ability.id}`)
                  }
                >
                  More Info
                </button>
              </Tooltip>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Abilities;

import React from "react";
import { Tooltip } from "react-tooltip";

export default function Abilities({ abilities }) {
  return (
    <ol className="abilities-list">
      {abilities.map((ability, i) => {
        const hasAbilityText = ability.pokemon_v2_ability.text.length > 0;
        const popupText = hasAbilityText
          ? ability.pokemon_v2_ability.text[0].short_effect
          : null;
        return (
          <li
            key={i}
            className="popup-location"
            data-tip
            data-tooltip-id={ability.pokemon_v2_ability.id}
          >
            {ability.pokemon_v2_ability.name}
            {ability.is_hidden && " (Hidden)"}
            {hasAbilityText && (
              <Tooltip
                id={ability.pokemon_v2_ability.id}
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
                {popupText}
              </Tooltip>
            )}
          </li>
        );
      })}
    </ol>
  );
}

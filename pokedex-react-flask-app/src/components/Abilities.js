import React, { useState, useEffect } from "react";

export default function Abilities({ abilities }) {
  const [currentPopup, setCurrentPopup] = useState({
    popupText: null,
    index: null,
  });

  useEffect(() => {
    setCurrentPopup({
      popupText: null,
      index: null,
    });
  }, [abilities]);

  const handlePopupClick = ({ popupText, index }) => {
    if (
      popupText &&
      (currentPopup.popupText !== popupText || currentPopup.index !== index)
    ) {
      setCurrentPopup({ popupText, index });
    } else {
      setCurrentPopup({
        popupText: null,
        index: null,
      });
    }
  };

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
            onClick={() => {
              handlePopupClick({
                popupText: popupText,
                index: i,
              });
            }}
          >
            {ability.pokemon_v2_ability.name}
            {ability.is_hidden && " (Hidden)"}
            {hasAbilityText &&
              currentPopup.popupText === popupText &&
              currentPopup.index === i && (
                <div className="popup">{popupText}</div>
              )}
          </li>
        );
      })}
    </ol>
  );
}

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getItemSprite } from "../../helpers/pictures";
import { formatName } from "../../helpers/format";

import { modifyHeldItems } from "../../helpers/modifyHeldItems";

import "./HeldItems.scss";

const HeldItems = ({ items }) => {
  const navigate = useNavigate();
  const itemsByGeneration = useMemo(() => modifyHeldItems(items), [items]);
  const generationOptions = useMemo(
    () => Object.keys(itemsByGeneration),
    [itemsByGeneration]
  );
  const [generation, setGeneration] = useState();

  useEffect(() => {
    if (generationOptions.length > 0) setGeneration(generationOptions[0]);
  }, [generationOptions]);

  if (!itemsByGeneration || !generation || !itemsByGeneration[generation]) return null;

  const generationItems = itemsByGeneration[generation].sort(
    (a, b) => a.rarity - b.rarity
  );

  return (
    <div className="app__held-item">
      <h4>Held Items</h4>
      <div className="select-input">
        <label htmlFor="HeldItemGenerationSelector">Generation:</label>
        <select
          id="HeldItemGenerationSelector"
          value={generation}
          onChange={(e) => setGeneration(parseInt(e.target.value))}
        >
          {generationOptions.map((type, i) => {
            return (
              <option key={i} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      <ul className="held-item-list">
        {generationItems.map((item, i) => (
          <li
            className="held-item-list-item"
            key={i}
            onClick={() => navigate(`/items/${item.id}`)}
          >
            <img src={getItemSprite(item.name)} />
            {formatName(item.name)} {item.rarity}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeldItems;

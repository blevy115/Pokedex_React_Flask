import React from "react";
import { useNavigate } from "react-router-dom";

import { mergeForms } from "../../helpers/mergeForms";
import { getFormSprite } from "../../helpers/pictures";
import { formatName } from "../../helpers/format";
import { handleSpriteError } from "../../helpers/error";

import "./PokemonForms.scss";

const PokemonForms = ({ forms, pokemonId }) => {
  const navigate = useNavigate();
  const mergedForms = mergeForms(forms);

  if (mergedForms.length <= 1) return;

  return (
    <>
      <h4 className="text-center">Pokemon Forms</h4>
      <div className="pokemon-forms-container">
        {mergedForms.map((form) => {
          const spritePath = getFormSprite(
            JSON.parse(form.pokemon_v2_pokemonformsprites[0].sprites)
              .front_default
          );
          return (
            <div
              className={`pokemon-form-item-container ${
                pokemonId != form.pokemon_id ? "clickable" : ""
              }`}
              key={form.id}
              onClick={() => {
                if (pokemonId !== form.pokemon_id) {
                  navigate(`/pokemon/${form.pokemon_id}`);
                }
              }}
            >
              <div className="circle"></div>
              <img
                className="sprite"
                src={spritePath}
                onError={handleSpriteError}
              />
              <p className="name">{formatName(form.name)}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PokemonForms;

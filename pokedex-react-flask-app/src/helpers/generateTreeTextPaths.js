import React from "react";

import { textOffsetByLength } from "./textOffsetbyLengthHelper";
import { formatName } from "./format";

const pathText = (info) => {
  const textParts = [];
  let navigateObject = { index: null, type: null, id: null };
  switch (info.pokemon_v2_evolutiontrigger.id) {
    case 1:
      textParts.push(`Level up`);
      break;
    case 3:
      navigateObject = {
        index: textParts.length,
        type: "items",
        id: info.pokemon_v2_item.id,
      };
      textParts.push(`Use ${formatName(info.pokemon_v2_item.name)}`);
      break;
    default:
      textParts.push(formatName(info.pokemon_v2_evolutiontrigger.name));
  }
  if (info.min_level) {
    textParts.push(` at ${info.min_level}`);
  }
  if (info.min_happiness) {
    textParts.push(` with happiness`);
  }
  if (info.pokemonV2ItemByHeldItemId) {
    navigateObject = {
      index: textParts.length,
      type: "items",
      id: info.pokemonV2ItemByHeldItemId.id,
    };
    textParts.push(` with ${formatName(info.pokemonV2ItemByHeldItemId.name)}`);
  }
  if (info.time_of_day) {
    textParts.push(` at ${info.time_of_day}`);
  }
  if (info.pokemon_v2_location) {
    textParts.push(` at ${formatName(info.pokemon_v2_location.name)}`);
  }
  if (info.pokemon_v2_move) {
    navigateObject = {
      index: textParts.length,
      type: "moves",
      id: info.pokemon_v2_move.id,
    };
    textParts.push(` + ${formatName(info.pokemon_v2_move.name)}`);
  }
  if (info.pokemon_v2_gender) {
    textParts.push(` (${info.pokemon_v2_gender.name})`);
  }
  if (info.turn_upside_down) {
    textParts.push(" while upside down");
  }
  if (info.needs_overworld_rain) {
    textParts.push(" in rain");
  }
  if (info.pokemonV2PokemonspecyByTradeSpeciesId) {
    navigateObject = {
      index: textParts.length,
      type: "pokemon",
      id: info.pokemonV2PokemonspecyByTradeSpeciesId.id,
    };
    textParts.push(
      ` with ${formatName(info.pokemonV2PokemonspecyByTradeSpeciesId.name)}`
    );
  }
  if (info.min_beauty) {
    textParts.push(" with High Beauty");
  }
  if (info.game) {
    textParts.push(` in ${info.game}`);
  }
  if (info.natures) {
    textParts.push(` with ${info.natures}`);
  }
  if (info.special) {
    if (info.special.hasNavigate) {
      navigateObject = {
        index: textParts.length,
        type: info.special.navigate.type,
        id: info.special.navigate.id,
      };
    }
    textParts.push(info.special.text);
  }
  if (info.relative_physical_stats || info.relative_physical_stats === 0) {
    switch (info.relative_physical_stats) {
      case -1:
        textParts.push("  (Atk < Def)");
        break;
      case 1:
        textParts.push("  (Atk > Def)");
        break;
      case 0:
        textParts.push(" (Atk = Def)");
        break;
      default:
        break;
    }
  }
  return { textParts, navigateObject };
};

export function generateTextPaths(node, treeDepth, navigate) {
  const textPaths = [];

  if (node.evolutionInfo) {
    const {
      textParts,
      navigateObject: { id, type, index },
    } = pathText(node.evolutionInfo);

    textPaths.push(
      <textPath
        key={node.pathProps.id}
        xlinkHref={`#${node.pathProps.id}`}
        startOffset={textOffsetByLength(textParts.join(""), treeDepth) + "%"}
      >
        <tspan dy="-10">
          {textParts.map((text, i) => (
            <tspan
              key={i}
              className={i === index ? "clickable" : ""}
              onClick={i === index ? () => navigate(`/${type}/${id}`) : null}
            >
              {text}
            </tspan>
          ))}
        </tspan>
      </textPath>
    );
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      textPaths.push(...generateTextPaths(child, treeDepth, navigate));
    });
  }

  return textPaths;
}

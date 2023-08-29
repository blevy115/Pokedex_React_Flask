import React from "react";
import { useNavigate } from "react-router-dom";
import { Tree } from "react-tree-graph";
import { useResizeDetector } from "react-resize-detector";

import {
  buildEvolutionTree,
  buildSpecialChain,
} from "../../helpers/evolutionChainHelper";
import { textOffsetByLength } from "../../helpers/textOffsetbyLengthHelper";

import { formatName } from "../../helpers/format";

import "./EvolutionaryChain.scss";

const eeveeId = 67;
const specialId = 250; // Phione and Manaphy

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
  return { textParts, navigateObject };
};

const generateTextPaths = (node, treeDepth, navigate) => {
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
};

const MyTreeTextPaths = ({ treeData, treeDepth, navigate }) => {
  const textPaths = generateTextPaths(treeData, treeDepth, navigate);
  return (
    <svg>
      <text fontFamily="Verdana" fontSize="12" fill="black">
        {textPaths}
      </text>
    </svg>
  );
};

const EvolutionaryChain = ({ chain }) => {
  const navigate = useNavigate();
  const { width, height, ref } = useResizeDetector();

  if (chain.pokemon_v2_pokemonspecies.length <= 1) return;

  const isEevee = chain.id === eeveeId;
  const isSpecial = chain.id === specialId;

  const { rootNodes, treeDepth } = !isSpecial
    ? buildEvolutionTree(chain, navigate)
    : buildSpecialChain(chain, navigate);

  return (
    <div className={`tree ${isEevee ? " extend" : ""}`} ref={ref}>
      <h4 className="text-center">Evolution Chain</h4>
      <Tree
        animated
        data={rootNodes[0]}
        height={height ? height : 250}
        width={width ? width * 0.99 : 400}
        nodeShape="image"
        svgProps={{ transform: "translate(50,10)" }}
        pathProps={{
          markerMid: "url(#arrow)",
        }}
        pathFunc={(x1, y1, x2, y2) => {
          let bool = false;
          if (bool)
            return `M${x1},${y1}C${(x1 + x2) / 2},${y1} ${
              (x1 + x2) / 2
            },${y2} ${x2},${y2}`;

          const ctrlX1 = x1 + (x2 - x1) / 2;
          const ctrlY1 = y1 + (y2 - y1) / 1.3;
          const ctrlX2 = x1 + ((x2 - x1) * 2) / 3;
          const ctrlY2 = y2;

          return `M${x1},${y1}C${x1},${y1} ${ctrlX1},${ctrlY1} ${ctrlX1},${ctrlY1} C${ctrlX2},${ctrlY2} ${ctrlX2},${ctrlY2} ${x2},${y2}`;
        }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="10"
            markerHeight="10"
            orient={!isSpecial ? "auto" : 180}
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,10 L10,5 z" fill="black" />
          </marker>
        </defs>
        <MyTreeTextPaths
          treeData={rootNodes[0]}
          treeDepth={treeDepth}
          navigate={navigate}
        />
      </Tree>
    </div>
  );
};

export default EvolutionaryChain;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Tree } from "react-tree-graph";
import { useResizeDetector } from "react-resize-detector";

import {
  buildEvolutionTree,
  buildSpecialChain,
} from "../../helpers/evolutionChainHelper";

import "./EvolutionaryChain.scss";

const eeveeId = 67;
const specialId = 250; // Phione and Manaphy

const generateTextPaths = (node) => {
  const textPaths = [];

  if (node.evolutionInfo && node.evolutionInfo.pokemon_v2_evolutiontrigger) {
    textPaths.push(
      <textPath
        key={node.pathProps.id}
        xlinkHref={`#${node.pathProps.id}`}
        startOffset="50%"
      >
        <tspan dy="-10">
          {node.evolutionInfo.pokemon_v2_evolutiontrigger.name}
        </tspan>
      </textPath>
    );
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      textPaths.push(...generateTextPaths(child));
    });
  }

  return textPaths;
};

const MyTreeTextPaths = ({ treeData }) => {
  const textPaths = generateTextPaths(treeData);
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

  const rootNodes = !isSpecial
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
        <MyTreeTextPaths treeData={rootNodes[0]} />
      </Tree>
    </div>
  );
};

export default EvolutionaryChain;

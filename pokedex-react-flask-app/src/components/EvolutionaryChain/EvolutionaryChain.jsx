import React from "react";
import { useNavigate } from "react-router-dom";
import { Tree } from "react-tree-graph";
import { useResizeDetector } from "react-resize-detector";

import { buildEvolutionTree } from "../../helpers/evolutionChainHelper";

import "./EvolutionaryChain.scss";

const generateTextPaths = (node) => {
  const textPaths = [];

  if (node.evolutionInfo && node.evolutionInfo.pokemon_v2_evolutiontrigger) {
    textPaths.push(
      <textPath key={node.pathProps.id} xlinkHref={`#${node.pathProps.id}`} startOffset="40%">
        {node.evolutionInfo.pokemon_v2_evolutiontrigger.name}
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
    <svg style={{ position: "absolute", left: 85, top: 25, width: "100%", pointerEvents: "none" }}>
      <text fontFamily="Verdana" fontSize="12" fill="blue">
        {textPaths}
      </text>
    </svg>
  );
};

const EvolutionaryChain = ({ chain }) => {
  const navigate = useNavigate();

  const rootNodes = buildEvolutionTree(chain, navigate);
  console.log(rootNodes[0]);

  const { width, height, ref } = useResizeDetector();
  return (
    <div className="tree" ref={ref} style={{position:"relative"}}>
      <Tree
        animated
        data={rootNodes[0]}
        height={height ? height : 200}
        width={width ? width * 0.99 : 400}
        nodeShape="image"
        svgProps={{ transform: "translate(50,10)" }}
      />
      <MyTreeTextPaths treeData={rootNodes[0]} />
    </div>
  );
};

export default EvolutionaryChain;

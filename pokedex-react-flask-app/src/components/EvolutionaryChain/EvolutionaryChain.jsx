import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tree } from "react-tree-graph";
import { useResizeDetector } from "react-resize-detector";

import {
  buildEvolutionTree,
  buildSpecialChain,
  hideEvolutionIds,
} from "../../helpers/evolutionChainHelper";
import { generateTextPaths } from "../../helpers/generateTreeTextPaths";
import { calculateTreePath } from "../../helpers/calculateTreePaths";

import { formatName } from "../../helpers/format";

import "./EvolutionaryChain.scss";

const eeveeId = 67;
const specialId = 250; // Phione and Manaphy

const TreePathArrow = ({ isSpecial }) => (
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
);

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

const EvolutionaryChain = ({ chain, pokemonId }) => {
  const navigate = useNavigate();
  const [generation, setGeneration] = useState();
  const [chainForm, setChainForm] = useState();
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    setGeneration(undefined);
    setChainForm(undefined);
  }, [chain.id]);

  if (
    hideEvolutionIds.includes(pokemonId) ||
    chain.pokemon_v2_pokemonspecies.length <= 1
  )
    return;

  const isEevee = chain.id === eeveeId;
  const isSpecial = chain.id === specialId;

  const { rootNodes, treeDepth, generations, chainForms } = !isSpecial
    ? buildEvolutionTree(chain, navigate, pokemonId, generation, chainForm)
    : buildSpecialChain(chain, navigate);

  if (rootNodes[0].children.length < 1) return;

  if (!generation && generations?.length) setGeneration(generations[0]);
  if (!chainForm && chainForms?.length) setChainForm(chainForms[0]);

  return (
    <div className={`tree ${isEevee ? " extend" : ""}`} ref={ref}>
      <h4 className="text-center">Evolution Chain</h4>
      {generations.length > 0 && (
        <div className="select-input">
          <label htmlFor="chainGenerationSelector">Generation:</label>
          <select
            id="chainGenerationSelector"
            value={generation}
            onChange={(e) => setGeneration(e.target.value)}
          >
            {generations.map((gen, i) => (
              <option key={i} value={gen}>
                {gen}
              </option>
            ))}
          </select>
        </div>
      )}
      {chainForms.length > 0 && (
        <div className="select-input">
          <label htmlFor="ChainFormSelector">Form:</label>
          <select
            id="ChainFormSelector"
            value={chainForm}
            onChange={(e) => setChainForm(e.target.value)}
          >
            {chainForms.map((form, i) => (
              <option key={i} value={form}>
                {formatName(form)}
              </option>
            ))}
          </select>
        </div>
      )}
      <Tree
        animated
        data={rootNodes[0]}
        height={height ? height : 250}
        width={width ? width * 0.99 : 400}
        nodeShape="image"
        svgProps={{ className: "tree-svg" }}
        pathProps={{
          markerMid: "url(#arrow)",
        }}
        pathFunc={(x1, y1, x2, y2) => calculateTreePath(x1, y1, x2, y2)}
        margins={{
          bottom: 10,
          left: 50,
          right: 125,
          top: 10,
        }}
      >
        <TreePathArrow isSpecial={isSpecial} />
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

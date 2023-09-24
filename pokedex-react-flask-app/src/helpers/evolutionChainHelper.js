import { getSprite } from "./pictures";
import { formatName } from "./format";
import special_evolution from "../data/special_evolution_chains.json";

const totemIds = [
  10093, 10121, 10122, 10128, 10129, 10144, 10145, 10146, 10149, 10150, 10153,
  10154,
];
const pikachuFormIds = [
  10080, 10081, 10082, 10083, 10084, 10085, 10094, 10095, 10096, 10097, 10098,
  10099, 10148, 10158, 10160, 10159,
];
const changedFormIds = [10017, 10061, 10178, 10116, 10117, 10026];

export const evolutionTriggerHash = {
  1: "level-up",
  2: "trade",
  3: "use-item",
  4: "shed",
  5: "spin",
  6: "tower-of-darkness",
  7: "tower-of-waters",
  8: "three-critical-hits",
  9: "take-damage",
  10: "other",
  11: "agile-style-move",
  12: "strong-style-move",
  13: "recoil-damage",
};

export const hideEvolutionIds = [
  ...totemIds,
  ...pikachuFormIds,
  ...changedFormIds,
];

class PokemonNode {
  constructor(speciesName, speciesId, evolutionInfo, navigate) {
    this.name = formatName(speciesName);
    this.evolutionInfo = evolutionInfo;
    this.evolutionTrigger = evolutionInfo?.pokemon_v2_evolutiontrigger.name;
    this.children = [];
    this.imageSrc = speciesId;
    this.id = speciesId;
    (this.nodeProps = {
      width: 80,
      height: 80,
      x: -30,
      y: -60,
      href: getSprite(speciesId),
    }),
      (this.gProps = {
        className: "clickable evolution-tree-node",
        onClick: () => navigate(`/pokemon/${parseInt(speciesId)}`),
      });
    this.textProps = {
      dx: formatName(speciesName).length * -3,
      dy: 25,
    };
    this.pathProps = {
      id: "path-" + speciesId,
    };
  }
}

export function buildEvolutionTree(
  evolutionData,
  navigate,
  pokemonId,
  generation,
  chainForm
) {
  const speciesData = evolutionData.pokemon_v2_pokemonspecies;
  const evolutionDict = {};

  const rootNodes = [];
  const isFormChain = special_evolution[evolutionData.id];
  const newInfo = isFormChain
    ? isFormChain.find((formChain) => formChain.ids.includes(pokemonId))
    : null;

  for (const species of newInfo?.hasAddedEvolution
    ? [...speciesData, ...newInfo.addedEvolution]
    : speciesData) {
    evolutionDict[species.id] = {
      name: species.name,
      id: species.id,
      evolutionInfo: null,
    };
  }

  for (const species of newInfo?.hasAddedEvolution
    ? [...speciesData, ...newInfo.addedEvolution]
    : speciesData) {
    const speciesId = species.id;
    const showDifferentChain = newInfo && newInfo["change"][speciesId];
    const evolvesFromId = species.evolves_from_species_id;
    let evolutions = species.pokemon_v2_pokemonevolutions;
    if (
      showDifferentChain &&
      newInfo["hasAddedGenerationEvolutions"] &&
      newInfo["addedGenerationEvolutions"] &&
      newInfo["addedGenerationEvolutions"][speciesId]
    ) {
      evolutions = [
        ...evolutions,
        newInfo["addedGenerationEvolutions"][speciesId],
      ].sort((a, b) => a.id - b.id);
    }
    let evolutionInfo =
      evolutions[
        showDifferentChain
          ? newInfo["hasGenerationSelector"] && generation
            ? newInfo["generations"].indexOf(generation)
            : newInfo["evolutionIndex"]
          : 0
      ];

    if (
      evolutionInfo &&
      newInfo &&
      newInfo["hasCustomEvolution"] &&
      newInfo["customEvolution"].find(
        (custumEvolution) => custumEvolution.id === evolutionInfo.id
      )
    ) {
      evolutionInfo = newInfo["customEvolution"].find(
        (custumEvolution) => custumEvolution.id === evolutionInfo.id
      );
    }
    if (evolutionInfo) {
      evolutionDict[speciesId].evolutionInfo = evolutionInfo;
    }
    const node = new PokemonNode(
      showDifferentChain
        ? newInfo["change"][speciesId].name +
          (newInfo["hasChainFormSelector"] && chainForm ? `-${chainForm}` : "")
        : evolutionDict[speciesId].name,
      showDifferentChain
        ? newInfo["customChainIds"] && newInfo["customChainIds"][speciesId]
          ? newInfo["customChainIds"][speciesId][chainForm]
          : newInfo["change"][speciesId].id +
            (newInfo["hasChainFormSelector"] && chainForm
              ? `-${chainForm}`
              : "")
        : evolutionDict[speciesId].id,
      evolutionInfo,
      navigate
    );
    evolutionDict[speciesId].node = node;
    if (evolvesFromId === null) {
      rootNodes.push(node);
    } else {
      const parentNode = evolutionDict[evolvesFromId].node;
      if (
        parentNode &&
        !(
          newInfo &&
          evolutionInfo &&
          newInfo["removeEvolutionIds"].includes(evolutionInfo.id)
        )
      ) {
        parentNode.children.push(node);
      }
    }
  }

  const calculateDepth = (node) => {
    if (!node) {
      return 0;
    }

    let maxChildDepth = 0;

    for (const child of node.children) {
      const childDepth = calculateDepth(child);
      if (childDepth > maxChildDepth) {
        maxChildDepth = childDepth;
      }
    }

    return maxChildDepth + 1;
  };

  const treeDepth = rootNodes.reduce((maxDepth, rootNode) => {
    const depth = calculateDepth(rootNode);
    return Math.max(maxDepth, depth);
  }, 0);
  const generations =
    newInfo && newInfo["hasGenerationSelector"] ? newInfo["generations"] : [];
  const chainForms =
    newInfo && newInfo["hasChainFormSelector"] ? newInfo["chainForms"] : [];
  return { rootNodes, treeDepth, generations, chainForms };
}

export function buildSpecialChain(evolutionData, navigate) {
  const speciesData = evolutionData.pokemon_v2_pokemonspecies;
  const rootNodes = [];
  for (const species of speciesData) {
    const speciesId = species.id;

    const evolutionInfo =
      speciesId === 490
        ? {
            pokemon_v2_evolutiontrigger: {
              name: "breed",
            },
          }
        : null;

    const node = new PokemonNode(
      species.name,
      speciesId,
      evolutionInfo,
      navigate
    );

    if (!rootNodes.length) {
      rootNodes.push(node);
    } else {
      const parentNode = rootNodes[0];
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  }

  return { rootNodes, treeDepth: 2, generations: [], chainForms: [] };
}

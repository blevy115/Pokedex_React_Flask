import { getSprite } from "./pictures";
import { formatName } from "./format";

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
        onClick: () => navigate(`/pokemon/${speciesId}`),
      });
    this.textProps = {
      dx: -20,
      dy: 20,
    };
    this.pathProps = {
      id: "path-" + speciesId,
    };
  }
}

export function buildEvolutionTree(evolutionData, navigate) {
  const speciesData = evolutionData.pokemon_v2_pokemonspecies;
  const evolutionDict = {};

  for (const species of speciesData) {
    evolutionDict[species.id] = {
      name: species.name,
      id: species.id,
      evolutionInfo: null,
    };
  }

  const rootNodes = [];

  for (const species of speciesData) {
    const speciesId = species.id;
    const evolvesFromId = species.evolves_from_species_id;

    const evolutionInfo = species.pokemon_v2_pokemonevolutions[0];

    if (evolutionInfo) {
      evolutionDict[speciesId].evolutionInfo = evolutionInfo;
    }

    const node = new PokemonNode(
      evolutionDict[speciesId].name,
      evolutionDict[speciesId].id,
      evolutionInfo,
      navigate
    );
    evolutionDict[speciesId].node = node;

    if (evolvesFromId === null) {
      rootNodes.push(node);
    } else {
      const parentNode = evolutionDict[evolvesFromId].node;
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  }

  return rootNodes;
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

  return rootNodes;
}

// Example usage
// const evolutionData = /* Your evolution data object */;
// const rootNodes = buildEvolutionTree(evolutionData);

// // Print the evolution tree with additional info
// function printEvolutionTree(node, level = 0) {
//     const indent = "  ".repeat(level);
//     const info = node.evolutionInfo;
//     let infoString = "";

//     if (info) {
//         if (info.min_level !== null) {
//             infoString += `Min Level: ${info.min_level}`;
//         }
//         if (info.min_happiness !== null) {
//             infoString += `Min Happiness: ${info.min_happiness}`;
//         }
//         if (info.pokemon_v2_item) {
//             infoString += `Evolution Item: ${info.pokemon_v2_item.name}`;
//         }
//         if (info.pokemon_v2_move) {
//             infoString += `Evolution Move: ${info.pokemon_v2_move.name}`;
//         }
//     }

//     console.log(indent + node.speciesName + (infoString ? ` (${infoString})` : ""));

//     for (const child of node.children) {
//         printEvolutionTree(child, level + 1);
//     }
// }

// for (const rootNode of rootNodes) {
//     printEvolutionTree(rootNode);
// }

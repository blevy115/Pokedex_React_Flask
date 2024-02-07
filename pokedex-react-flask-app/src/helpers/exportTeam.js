import { formatName } from "./format";

const statsOrder = ["HP", "Atk", "Def", "Spe", "SpD", "SpA"];

export function exportTeam(team) {
  let textData = "";

  team.pokemons.forEach((pokemon) => {
    if (pokemon.pokemon) {
      textData += `${formatName(pokemon.pokemon.name)} ${
        pokemon.item ? `@ ${formatName(pokemon.item.name)}` : ""
      }\n`;
      textData += pokemon.ability
        ? `Ability: ${formatName(pokemon.ability.name)}\n`
        : "";
      textData += pokemon.level !== 100 ? `Level: ${pokemon.level}\n` : "";
      textData += pokemon.teraType
        ? `Tera Type: ${formatName(pokemon.teraType.name)}\n`
        : "";
      textData += `EVs: ${pokemon.evs
        .map((ev, index) => ev !== 0 && `${ev} ${statsOrder[index]}`)
        .filter(Boolean)
        .join(" / ")}\n`;
      textData += pokemon.nature ? `${pokemon.nature.name} Nature\n` : "";
      textData += `IVs: ${pokemon.ivs
        .map((iv, index) => iv !== 31 && `${iv} ${statsOrder[index]}`)
        .filter(Boolean)
        .join(" / ")}\n`;
      textData += `Moves: \n${pokemon.moves
        .map((move) => move.move && `- ${formatName(move.move.name)}`)
        .filter(Boolean)
        .join("\n")}\n\n`;
    }
  });

  const element = document.createElement("a");
  const file = new Blob([textData], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = "team_details.txt";
  document.body.appendChild(element);
  element.click();
}

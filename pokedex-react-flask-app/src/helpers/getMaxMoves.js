import gmax_moves from "../data/gmax_moves.json";
import max_moves from "../data/max_moves.json";

export function isGmaxMove(id) {
  return gmax_moves[id];
}

export function isMaxMove(id) {
  return max_moves[id];
}
export function getGmaxMove(pokemonId) {
  for (const moveId in gmax_moves) {
    const pokemonList = gmax_moves[moveId].pokemon;
    if (pokemonList?.some((pokemon) => pokemon.id === pokemonId)) {
      const move = gmax_moves[moveId];
      return {
        ...move,
        id: moveId,
      };
    }
  }
  return null;
}

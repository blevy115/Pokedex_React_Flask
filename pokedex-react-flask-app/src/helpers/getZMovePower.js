import z_power_effect_status_moves from "../data/z_power_effect_status_moves.json";
import z_moves from "../data/z_moves.json";

export function getZMovePower(move) {
  let power;
  switch (true) {
    // Non-Standard Z-Power Moves
    case move.id === 165: // Struggle
      power = 1;
      break;
    case move.id === 72: // Mega Drain
      power = 120;
      break;
    case move.id === 222: // Magnitude
    case move.id === 687: // Core Enforcer
      power = 140;
      break;
    case move.id === 67: // Low Kick
    case move.id === 175: // Flail
    case move.id === 179: // Reversal
    case move.id === 216: // Return
    case move.id === 218: // Frustration
    case move.id === 283: // Endeavor
    case move.id === 311: // Weather Ball
    case move.id === 360: // Gyro Ball
    case move.id === 363: // Natural Gift
    case move.id === 376: // Trump Card
    case move.id === 386: // Punishment
    case move.id === 447: // Grass Knot
    case move.id === 484: // Heavy Slam
    case move.id === 486: // Electro Ball
    case move.id === 500: // Stored Power
    case move.id === 506: // Hex
    case move.id === 535: // Heat Crash
    case move.id === 681: // Power Trip
      power = 160;
      break;
    case move.id === 560: // Flying Press
      power = 170;
      break;
    case move.id === 515: // Final Gambit
    case move.id === 544: // Gear Grind
    case move.id === 614: //Thousand Arrows
      power = 180;
      break;
    case move.id === 616: // Lands Wrath
    case move.id === 718: // Multi Attack
      power = 185;
      break;
    case move.id === 378: //Wring OUt
    case move.id === 462: // Crush Grip
      power = 190;
      break;
    case move.id === 557: // V Create
      power = 220;
      break;
    // Multi Hit Moves
    case move.id === 167: // Triple Kick
      power = 120;
      break;
    case move.id === 42: // Pin Missile
    case move.id === 198: // Bone Rush
    case move.id === 331: // Bullet Seed
    case move.id === 333: // Icicle Spear
    case move.id === 350: // Rock Blast
    case move.id === 458: // Double Hit
    case move.id === 541: // Tail Slap
      power = 140;
      break;
    // OHKO Moves
    case move.categoryId === 9:
      power = 180;
      break;
    // Status Moves
    case !!z_power_effect_status_moves[move.id]:
      power = z_power_effect_status_moves[move.id];
      break;
    // Standard Z-Power Moves
    case move.power <= 55:
      power = 100;
      break;
    case move.power <= 65:
      power = 120;
      break;
    case move.power <= 75:
      power = 140;
      break;
    case move.power <= 85:
      power = 160;
      break;
    case move.power <= 95:
      power = 175;
      break;
    case move.power === 100:
      power = 180;
      break;
    case move.power === 110:
      power = 185;
      break;
    case move.power <= 125:
      power = 190;
      break;
    case move.power === 130:
      power = 195;
      break;
    case move.power >= 140:
      power = 200;
      break;
    default:
      power = 100;
      break;
  }
  return power;
}

export function isZMove(id) {
  return !!z_moves[id];
}

export function getZMoveData(id) {
  return z_moves[id];
}

export function getZMoveByType(typeId) {
  for (const moveId in z_moves) {
    if (z_moves[moveId]?.type.id === typeId) {
      return { id: moveId, name: z_moves[moveId].name };
    }
  }
  return null;
}

export function doesPokemonHaveUniqueZMove(pokemonId) {
  for (const moveId in z_moves) {
    const pokemonList = z_moves[moveId].pokemon;
    if (pokemonList?.some((pokemon) => pokemon.id === pokemonId)) {
      const move = z_moves[moveId];
      return {
        ...move,
        id: moveId,
      };
    }
  }
  return null;
}

export function doesMoveHaveUniqueZMoves(moveId) {
  const moveZMoves = [];
  for (const ZMoveId in z_moves) {
    const { move, pokemon } = z_moves[ZMoveId];
    if (move?.id === moveId) {
      for (const pokemonEntry in pokemon) {
        moveZMoves.push({
          ...z_moves[ZMoveId],
          id: ZMoveId,
          pokemon: pokemon[pokemonEntry],
        });
      }
    }
  }
  return moveZMoves;
}

export function doesItemHaveZMove(itemId) {
  for (const moveId in z_moves) {
    if (z_moves[moveId].item.id === itemId) {
      return { id: moveId, ...z_moves[moveId] };
    }
  }
  return null;
}

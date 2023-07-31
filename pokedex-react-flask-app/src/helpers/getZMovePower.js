import z_power_effect_status_moves from "../data/z_power_effect_status_moves.json";
import z_moves from "../data/z_moves.json";

export function getZMovePower(move) {
  let power;
  switch (true) {
    case move.id === 72: // Mega Drain
      power = 120;
      break;
    case move.id === 165: // Struggle
      power = 1;
      break;
    case move.id === 311: // Weather Ball
    case move.id === 506: // Hex
      power = 160;
      break;
    case move.id === 544: // Gear Grind
      power = 180;
      break;
    case move.id === 557: // V Create
      power = 220;
      break;
    case move.id === 560: // Flying Press
      power = 170;
      break;
    case move.id === 687: // Core Enforcer
      power = 140;
      break;
    case move.categoryId === 9: //OHKO Moves
      power = 180;
      break;
    case !!z_power_effect_status_moves[move.id]: // Check for status moves
      power = z_power_effect_status_moves[move.id];
      break;
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

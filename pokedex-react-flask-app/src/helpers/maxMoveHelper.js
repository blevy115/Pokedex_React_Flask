import gmax_moves from "../data/gmax_moves.json";
import max_moves from "../data/max_moves.json";

export function isGmaxMove(id) {
  return gmax_moves[id];
}

export function isMaxMove(id) {
  return max_moves[id];
}

export function getMaxMoveByType(type, kind) {
  if (kind.name === "status") {
    return Object.entries(max_moves)
      .filter(([, value]) => value.kind === "status")
      .map(([id, move]) => ({ id, ...move }))[0];
  } else {
    for (const moveId in max_moves) {
      if (!max_moves[moveId].kind && max_moves[moveId].type.id === type.id) {
        return { id: moveId, ...max_moves[moveId] };
      }
    }
  }
  return null;
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

export function getMaxMovePower(move, type) {
  let power;
  if (type.id === 2 || type.id === 4) {
    switch (true) {
      case move.id === 68: // Counter
      case move.id === 69: // Seismic Toss
        power = 75;
        break;
      case move.id === 24: // Double Kick
      case move.id === 167: // Triple Kick
        power = 80;
        break;
      case move.id === 67: // Low Kick
      case move.id === 179: // Reversal
      case move.id === 515: // Final Gambit
        power = 100;
        break;
      case move.power <= 40:
        power = 70;
        break;
      case move.power <= 50:
        power = 75;
        break;
      case move.power <= 60:
        power = 80;
        break;
      case move.power <= 70:
        power = 85;
        break;
      case move.power <= 100:
        power = 90;
        break;
      case move.power <= 140:
        power = 95;
        break;
      case move.power > 140:
        power = 100;
        break;
      default:
        power = move.power;
        break;
    }
  } else {
    switch (true) {
      case move.id === 718: // Multi Attack
        power = 95;
        break;
      case move.id === 101: // Night Shade
      case move.id === 154: // Fury Swipes
      case move.id === 162: // Super Fand
      case move.id === 217: // Present
      case move.id === 243: // Mirror Coat
      case move.id === 251: // Beat Upp
      case move.id === 255: // Spit Up
      case move.id === 368: // Metal Burst
      case move.id === 374: // Fling
      case move.id === 717: // Nature's Madness
        power = 100;
        break;
      case move.id === 458: // Double Hit
        power = 120;
        break;
      case move.id === 42: // Pin Missile
      case move.id === 155: // Bonemerang
      case move.id === 175: // Flail
      case move.id === 198: // Bone Rush
      case move.id === 283: // Endeavor
      case move.id === 311: // Weather Ball
      case move.id === 333: // Icicle Spear
      case move.id === 350: // Rock Blast
      case move.id === 360: // Gyro Ball
      case move.id === 447: // Grass Knot
      case move.id === 484: // Heavy Slam
      case move.id === 486: // Electro Ball
      case move.id === 500: // Stored Power
      case move.id === 530: // Dual Chop
      case move.id === 535: // Heat Crash
      case move.id === 541: // Tail Slap
      case move.id === 544: // Gear Grind
      case move.id === 566: // Phantom Force
      case move.id === 681: // Power Trip
      case move.id === 751: // Dragon Darts
      case move.id === 799: // Scale Shot
      case move.id === 805: // Terrain Pulse
      case move.id === 814: // Dual Wingbeat
      case move.id === 818: // Surging Strikes
        power = 130;
        break;
      case move.id === 462: // Crush Grip
      case move.id === 742: // Double Iron Bash
      case move.id === 744: // Dynamax Cannon
      case move.id === 804: // Rising Voltage
      case move.id === 813: // Triple Axel
        power = 140;
        break;
      // OHKO Moves
      case move.categoryId === 9:
        power = 130;
        break;
      case move.power <= 40:
        power = 90;
        break;
      case move.power <= 50:
        power = 100;
        break;
      case move.power <= 60:
        power = 110;
        break;
      case move.power <= 70:
        power = 120;
        break;
      case move.power <= 100:
        power = 130;
        break;
      case move.power <= 140:
        power = 140;
        break;
      case move.power > 140:
        power = 150;
        break;
      default:
        power = move.power;
        break;
    }
  }
  return power;
}

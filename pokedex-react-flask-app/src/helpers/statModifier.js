/*
    1. array of 6 stats at base value
    2. Level
    3. Nature
    4. 6 iv values
    5. EV Spread

    Note HP is calutlated differently

    HP = ((2 * Base_HP + IV + (EV/4))* Level/100) + Level + 10
    OtherStats = (((2 * Base_Stat + IV + (EV/4))* Level/100) + 5) * Nature
    
*/

const defaultValue = {
  hp: 0,
  attack: 0,
  defense: 0,
  "special-attack": 0,
  "special-defense": 0,
  speed: 0,
};

function calculateStats(
  stats,
  level = 50,
  nature = [{ up: "attack", down: "attack" }],
  ivs = { ...defaultValue },
  evs = { ...defaultValue }
) {
  const calculatedValues = {};
  for (const stat of stats) {
    const name = stat.pokemon_v2_stat.name;
    const baseStat = stat.base_stat;
    if (name === "hp") {
      calculatedValues[name] =
        ((2 * baseStat + ivs[name] + evs[name] / 4) * level) / 100 + level + 10;
    } else {
      calculatedValues[name] =
        ((2 * baseStat + ivs[name] + evs[name] / 4) * level) / 100 + 5;
    }

    if (nature["up"] === name) {
      calculatedValues[name] *= 1.1;
    }
    if (nature["down"] === name) {
      calculatedValues[name] *= 0.9;
    }
  }
  return calculatedValues;
}

function convertStats(stats) {
  const convertedValues = stats.reduce((acc, stat) => {
    const name = stat.pokemon_v2_stat.name;
    const baseStat = stat.base_stat;
    acc[name] = baseStat;
    return acc;
  }, {});
  return convertedValues;
}

export { convertStats, calculateStats };

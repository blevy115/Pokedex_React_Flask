/*
    1. array of 6 stats at base value
    2. Level
    3. Nature
    4. Iv values
    5. EV Spread

    Note HP is calutlated differently

    HP = ((2 * Base_HP + IV + (EV/4))* Level/100) + Level + 10
    OtherStats = (((2 * Base_Stat + IV + (EV/4))* Level/100) + 5) * Nature
    
*/

function calculateStats({
  baseStats,
  level,
  nature,
  ivs,
  evs,
}) {
  const calculatedValues = {};
  for (const stat of baseStats) {
    const name = stat.pokemon_v2_stat.name;
    const baseStat = stat.base_stat;
    if (name === "hp") {
      calculatedValues[name] =
      Math.trunc((Math.trunc(2 * baseStat + ivs[name] + evs[name] / 4) * level) / 100) + level + 10;
    } else {
      calculatedValues[name] =
      Math.trunc(Math.trunc(2 * baseStat + ivs[name] + evs[name] / 4) * level / 100) + 5;
    }

    if (nature["increasedStat"] === name) {
      calculatedValues[name] = Math.trunc(calculatedValues[name] * 1.1);
    }
    if (nature["decreasedStat"] === name) {
      calculatedValues[name] =  Math.trunc(calculatedValues[name] * 0.9);
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

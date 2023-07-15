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
const statOrder = [
  "hp",
  "attack",
  "defense",
  "speed",
  "special-defense",
  "special-attack",
];

function orderStats(stats) {
  return Object.fromEntries(
    Object.entries(stats).sort(
      ([key1], [key2]) => statOrder.indexOf(key1) - statOrder.indexOf(key2)
    )
  );
}

export function calculateStats({ baseStats, level, nature, ivs, evs }) {
  const calculatedValues = baseStats.reduce((stats, stat) => {
    const name = stat.pokemon_v2_stat.name;
    const baseStat = stat.base_stat;
    if (name === "hp") {
      stats[name] =
        Math.trunc(
          (Math.trunc(2 * baseStat + ivs[name] + evs[name] / 4) * level) / 100
        ) +
        (level + 10);
    } else {
      stats[name] =
        Math.trunc(
          (Math.trunc(2 * baseStat + ivs[name] + evs[name] / 4) * level) / 100
        ) + 5;
    }

    if (nature["increasedStat"] === name) {
      stats[name] = Math.trunc(stats[name] * 1.1);
    }
    if (nature["decreasedStat"] === name) {
      stats[name] = Math.trunc(stats[name] * 0.9);
    }
    return stats;
  }, {});
  return orderStats(calculatedValues);
}

export function convertStats(stats) {
  const convertedValues = stats.reduce((stats, stat) => {
    const name = stat.pokemon_v2_stat.name;
    const baseStat = stat.base_stat;
    stats[name] = baseStat;
    return stats;
  }, {});
  return orderStats(convertedValues);
}

export function calculateStatsTotal(stats) {
  return stats.reduce(
    (accumulator, currentValue) => accumulator + currentValue.base_stat,
    0
  );
}

export function getEvYield(stats) {
  const evStats = stats
    .filter((stat) => stat.effort > 0)
    .reduce(
      (stats, stat) => {
        const name = stat.pokemon_v2_stat.name;
        const effort = stat.effort;
        stats["evs"][name] = effort;
        stats["total"] += effort;
        return stats;
      },
      { total: 0, evs: {} }
    );
  return evStats;
}

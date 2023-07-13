import all_types from "../data/all_types.json";

export function getTypeEffectiveness(types) {
  const multipliers = {};

  types.forEach((type) => {
    const typeEffectiveness = all_types[type];
    const noDamage = typeEffectiveness.defense.zero;
    const halfDamage = typeEffectiveness.defense.half;
    const doubleDamage = typeEffectiveness.defense.double;

    noDamage.forEach((type) => {
      if (multipliers[type]) {
        multipliers[type] = multipliers[type] * 0;
      } else {
        multipliers[type] = 0;
      }
    });

    halfDamage.forEach((type) => {
      if (multipliers[type]) {
        multipliers[type] = multipliers[type] * 0.5;
      } else {
        multipliers[type] = 0.5;
      }
    });

    doubleDamage.forEach((type) => {
      if (multipliers[type]) {
        multipliers[type] = multipliers[type] * 2;
      } else {
        multipliers[type] = 2;
      }
    });
  });

  return multipliers;
}

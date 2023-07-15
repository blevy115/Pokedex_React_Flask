// Rate determined by response from pokeapi call
const ratiosByRate = {
  0: {
    male: 100,
    female: 0,
  },
  1: {
    male: 87.5,
    female: 12.5,
  },
  2: {
    male: 75,
    female: 25,
  },
  4: {
    male: 50,
    female: 50,
  },
  6: {
    male: 25,
    female: 75,
  },
  7: {
    male: 12.5,
    female: 87.5,
  },
  8: {
    male: 0,
    female: 100,
  },
  "-1": {
    male: null,
    female: null,
    unknown: "Gender Unknown",
  },
};

export function getGenderRatio(rate) {
    return ratiosByRate[rate]
}

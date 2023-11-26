const converter = {
  monster: "monster",
  water1: "water-1",
  bug: "bug",
  flying: "flying",
  ground: "field",
  fairy: "fairy",
  plant: "grass",
  humanshape: "human-like",
  water3: "water-3",
  mineral: "mineral",
  indeterminate: "amorphous",
  water2: "water-2",
  ditto: "ditto",
  dragon: "dragon",
  "no-eggs": "no-eggs",
};

export function eggGroupNameHelper(name) {
  return converter[name];
}

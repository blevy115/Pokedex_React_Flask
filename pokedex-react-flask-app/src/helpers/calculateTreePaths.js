export function calculateTreePath(x1, y1, x2, y2) {
  let bool = false;
  if (bool)
    return `M${x1},${y1}C${(x1 + x2) / 2},${y1} ${
      (x1 + x2) / 2
    },${y2} ${x2},${y2}`;

  const ctrlX1 = x1 + (x2 - x1) / 2;
  const ctrlY1 = y1 + (y2 - y1) / 1.3;
  const ctrlX2 = x1 + ((x2 - x1) * 2) / 3;
  const ctrlY2 = y2;

  return `M${x1},${y1}C${x1},${y1} ${ctrlX1},${ctrlY1} ${ctrlX1},${ctrlY1} C${ctrlX2},${ctrlY2} ${ctrlX2},${ctrlY2} ${x2},${y2}`;
}

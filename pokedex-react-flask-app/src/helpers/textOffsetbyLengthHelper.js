export function textOffsetByLength(text, depth) {
  const maxLength = 50;
  let minValue = 15;
  let maxValue = 50;

  if (depth === 2) {
    minValue *= 1.2;
    maxValue *= 1.2;
  }

  const length = text.length;
  const normalizedLength = Math.min(maxLength, length);

  const range = maxValue - minValue;
  const value = maxValue - (normalizedLength / maxLength) * range;
  return Math.max(minValue, Math.min(maxValue, value));
}

export function textOffsetByLength(text, depth) {
  const maxLength = 35;
  let minValue = 30;
  let maxValue = 60;
  const range = maxValue - minValue;

  const depthMultiplier = (depth === 2 ? 0.7 : 0.8) * range;

  const length = text.length;
  const normalizedLength = Math.min(maxLength, length);

  const value = maxValue - (normalizedLength / maxLength) * depthMultiplier;
  return Math.max(minValue, Math.min(maxValue, value));
}

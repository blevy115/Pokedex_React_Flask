export function calculateCatchPercent({
  catchRate,
  ballRate = 1,
  statusRate = 1,
  maxHealth = 100,
  currentHealth = 100,
}) {
  const x =
    (((3 * maxHealth) - (2 * currentHealth)) * catchRate * ballRate * statusRate) /
    (3 * maxHealth);
  return (Math.pow(x / 255, 0.75) * 100).toFixed(1) + "%";
}

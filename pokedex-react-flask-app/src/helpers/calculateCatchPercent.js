export function calculateCatchPercent(catchRate) {
  const x = catchRate / 3;
  return (Math.pow(x / 255, 0.75) * 100).toFixed(1) + "%";
}

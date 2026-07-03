export const formatNumberWithDecimals = (number: number, decimals = 1) => {
  const multiplyFactor = 10 ** decimals;
  const rounded = Math.round(number * multiplyFactor) / multiplyFactor;
  return rounded.toFixed(decimals);
};

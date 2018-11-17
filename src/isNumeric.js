export default function isNumeric(value) {
  const numeric = (+(value.replace(',', '.')));
  if (isNaN(numeric) || numeric === Infinity) {
    return false;
  }

  return numeric.toString(10) === value;
}
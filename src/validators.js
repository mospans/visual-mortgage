import isNumeric from './isNumeric'

const max = (value, ruleValue) => {
  return (!isNumeric(value) || value <= ruleValue);
};

const min = (value, ruleValue) => {
  return (!isNumeric(value) || value >= ruleValue);
};

export {
  max,
  min
};
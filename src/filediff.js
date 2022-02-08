/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import chooseFormat from './formatters/index.js';

const onlyInFile1 = '/!DELETED';
const onlyInFile2 = '/+ADDED';
const inTwoFiles = '/NOT CHANGED';
let depth = 0;

function genDiff(filepath1, filepath2, format = 'stylish') {
  const sortedFile1 = Object.entries(filepath1);
  const sortedFile2 = Object.entries(filepath2);
  const result = {};
  for (const [key1, value1] of sortedFile1) {
    for (const [key2, value2] of sortedFile2) {
      if (_.isObject(value1) && _.isObject(value2)) {
        if (key1 === key2) {
          depth += 1;
          result[key1 + inTwoFiles] = genDiff(value1, value2);
          depth -= 1;
        }
      }
      if (key1 === key2 && value1 === value2) {
        result[key1 + inTwoFiles] = value1;
      }
    }
    if (result[key1 + inTwoFiles] === undefined) {
      result[key1 + onlyInFile1] = value1;
    }
  }
  for (const [key2, value2] of sortedFile2) {
    if (result[key2 + inTwoFiles] === undefined) {
      result[key2 + onlyInFile2] = value2;
    }
  }
  if (depth === 0) {
    return chooseFormat(result, format);
  }
  return result;
}
export default genDiff;

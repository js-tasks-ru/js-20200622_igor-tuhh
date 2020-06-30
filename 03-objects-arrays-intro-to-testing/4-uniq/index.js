/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const set = new Set();

  if (!arr) {
    return [];
  }

  arr.forEach((element) => set.add(element)); // fast but second memory consuming collection created
  return set.values();

  // another possibility (much slower, but filtering is done "in-place")
  // return !arr ? [] : arr.filter((value, index) => arr.indexOf(value) === index);
}

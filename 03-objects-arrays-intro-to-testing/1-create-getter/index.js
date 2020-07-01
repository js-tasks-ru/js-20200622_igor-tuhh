/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  // array.splice is needed for performance reasons, so we make the array shorter at the place where no further nested properties could be found (it breaks reduce())
  const pathAsArray = path.split(".");
  return (obj) =>
    [...pathAsArray].reduce((accumulator, currentValue, index, array) => {
      if (typeof accumulator !== "object" || !accumulator[currentValue]) {
        array.splice(index);
        return undefined;
      }

      return accumulator[currentValue];
    }, obj);
}
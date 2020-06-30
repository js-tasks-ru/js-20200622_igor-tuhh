/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  // array.splice is needed for performance reasons, so we make the array shorter at the place where no further nested properties could be found
  return (obj) =>
    path
      .split(".")
      .reduce(
        (accumulator, currentValue, index, array) =>
          !accumulator ? array.splice(index) : accumulator[currentValue], 
        obj
      );
}

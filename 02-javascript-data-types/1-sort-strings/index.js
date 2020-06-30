/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  const clonedArray = [...arr];
  const sortingFactor = param === "desc" ? -1 : 1;
  const collator = new Intl.Collator(undefined, { caseFirst: "upper" });

  return clonedArray.sort((a, b) => collator.compare(a, b) * sortingFactor);
}

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

  const clonedArray = [...arr];
  const sortingType = param === 'desc' ? 1 : -1;
  quickSort(clonedArray, 0, arr.length - 1);
  return clonedArray;

  function quickSort(array, low, high) {
    if (low < high) {
      const partition = getPartition(array, low, high);
      quickSort(array, low, partition - 1);
      quickSort(array, partition + 1, high);
    }
  }
  
  function getPartition(array, low, high) {
    const pivot = array[high];
    let i = low;
    for (let j = low; j < high; j++) {
      if (array[j].localeCompare(pivot, undefined, {caseFirst: "upper"}) === sortingType) {
        swap(array, i, j);
        i = i + 1;
      }
    }
    
    swap(array, i, high);
    return i;
  }
    
  function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}



//sortStrings(['абрикос', 'Абрикос', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик'], "desc");


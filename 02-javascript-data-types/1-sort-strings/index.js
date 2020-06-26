/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

  let clonedArray = arr.slice(0);
  let sortingType = param === 'desc' ? 1 : -1;
  quickSort(clonedArray, 0, arr.length - 1);
  return clonedArray;

  function quickSort(array, low, high) {
    if (low < high) {
      let partition = getPartition(array, low, high);
      quickSort(array, low, partition - 1);
      quickSort(array, partition + 1, high);
    }
  }
  
  function getPartition(array, low, high) {
    let pivot = array[high];
    let i = low;
    for (let j = low; j < high; j++) {
      if (array[j].localeCompare(pivot, 'int', {caseFirst: "upper"}) == sortingType) {
        swap(array, i, j);
        i = i + 1;
      }
    }
    
    swap(array, i, high);
    return i;
  }
    
  function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}



//sortStrings(['абрикос', 'Абрикос', 'яблоко', 'Яблоко', 'ёжик', 'Ёжик'], "desc");


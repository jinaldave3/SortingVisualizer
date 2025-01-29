const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility Functions
const swap = (array, i, j) => {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
};

const highlightBars = (i, j, color) => {
  const bars = document.getElementsByClassName("bar");
  if (bars[i]) bars[i].style.backgroundColor = color;
  if (bars[j]) bars[j].style.backgroundColor = color;
};

const resetBars = (i, j) => {
  const bars = document.getElementsByClassName("bar");
  if (bars[i]) bars[i].style.backgroundColor = "turquoise";
  if (bars[j]) bars[j].style.backgroundColor = "turquoise";
};

const markSortedBars = (n) => {
  const bars = document.getElementsByClassName("bar");
  for (let i = 0; i < n; i++) {
    if (bars[i]) {
      bars[i].style.backgroundColor = "green"; // Safely access the bar
    }
  }
};

// Pause logic
const checkPause = async (pauseRef) => {
  while (pauseRef.current) {
    await new Promise((resolve) => setTimeout(resolve, 50)); // Wait while paused
  }
};

// Bubble Sort
export const bubbleSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      highlightBars(j, j + 1, "red");
      await sleep(delay);
      await checkPause(pauseRef);
      if (array[j] > array[j + 1]) {
        swaps++;
        swap(array, j, j + 1);
        setArray([...array]);
        await sleep(delay);
      }
      resetBars(j, j + 1);
    }
  }
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

// Selection Sort
export const selectionSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      highlightBars(minIdx, j, "red");
      await sleep(delay);
      await checkPause(pauseRef);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
      resetBars(minIdx, j);
    }
    if (minIdx !== i) {
      swaps++;
      swap(array, i, minIdx);
      setArray([...array]);
      await sleep(delay);
    }
  }
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

// Insertion Sort
export const insertionSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      comparisons++;
      array[j + 1] = array[j];
      swaps++;
      j--;
      setArray([...array]);
      await sleep(delay);
      await checkPause(pauseRef);
    }
    array[j + 1] = key;
    setArray([...array]);
    await sleep(delay);
  }
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

// Merge Sort
export const mergeSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0;

  const merge = async (left, right) => {
    let sorted = [];
    while (left.length && right.length) {
      comparisons++;
      if (left[0] < right[0]) sorted.push(left.shift());
      else sorted.push(right.shift());
      await sleep(delay);
      await checkPause(pauseRef);
      setArray([...sorted, ...left, ...right]);
    }
    return [...sorted, ...left, ...right];
  };

  const sort = async (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await sort(arr.slice(0, mid));
    const right = await sort(arr.slice(mid));
    return merge(left, right);
  };

  const sorted = await sort(array);
  markSortedBars(array.length);
  setStats({ comparisons });
  return sorted;
};

// Quick Sort
export const quickSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;

  const partition = async (low, high) => {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      if (array[j] < pivot) {
        i++;
        swaps++;
        swap(array, i, j);
        setArray([...array]);
        await sleep(delay);
        await checkPause(pauseRef);
      }
    }
    swap(array, i + 1, high);
    setArray([...array]);
    return i + 1;
  };

  const sort = async (low, high) => {
    if (low < high) {
      const pi = await partition(low, high);
      await sort(low, pi - 1);
      await sort(pi + 1, high);
    }
  };

  await sort(0, array.length - 1);
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

// Heap Sort
export const heapSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;

  const heapify = async (n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
      comparisons++;
      largest = left;
    }
    if (right < n && array[right] > array[largest]) {
      comparisons++;
      largest = right;
    }
    if (largest !== i) {
      swaps++;
      swap(array, i, largest);
      setArray([...array]);
      await sleep(delay);
      await checkPause(pauseRef);
      await heapify(n, largest);
    }
  };

  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    await heapify(array.length, i);
  }
  for (let i = array.length - 1; i > 0; i--) {
    swaps++;
    swap(array, 0, i);
    setArray([...array]);
    await sleep(delay);
    await checkPause(pauseRef);
    await heapify(i, 0);
  }
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

// Counting Sort
export const countingSort = async (array, setArray, setStats, delay, pauseRef) => {
  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  let comparisons = 0;

  for (let num of array) {
    count[num]++;
    await sleep(delay);
    await checkPause(pauseRef);
  }
  let sortedIndex = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      comparisons++;
      array[sortedIndex++] = i;
      count[i]--;
      setArray([...array]);
      await sleep(delay);
    }
  }
  markSortedBars(array.length);
  setStats({ comparisons });
};

// Radix Sort
export const radixSort = async (array, setArray, setStats, delay, pauseRef) => {
  const getMax = (arr) => Math.max(...arr);
  const countingSortForRadix = async (arr, exp) => {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);
    let comparisons = 0;

    for (let i = 0; i < arr.length; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      comparisons++;
      const idx = Math.floor(arr[i] / exp) % 10;
      output[count[idx] - 1] = arr[i];
      count[idx]--;
    }
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      setArray([...arr]);
      await sleep(delay);
      await checkPause(pauseRef);
    }
    return comparisons;
  };

  const max = getMax(array);
  let exp = 1, totalComparisons = 0;

  while (Math.floor(max / exp) > 0) {
    totalComparisons += await countingSortForRadix(array, exp);
    exp *= 10;
  }
  markSortedBars(array.length);
  setStats({ comparisons: totalComparisons });
};

// Shell Sort
export const shellSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;

  for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < array.length; i++) {
      const temp = array[i];
      let j = i;
      while (j >= gap && array[j - gap] > temp) {
        comparisons++;
        swaps++;
        array[j] = array[j - gap];
        j -= gap;
        setArray([...array]);
        await sleep(delay);
        await checkPause(pauseRef);
      }
      array[j] = temp;
      setArray([...array]);
    }
  }
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

// Cocktail Shaker Sort
export const cocktailShakerSort = async (array, setArray, setStats, delay, pauseRef) => {
  let comparisons = 0, swaps = 0;
  let start = 0, end = array.length;

  while (start < end) {
    let swapped = false;
    for (let i = start; i < end - 1; i++) {
      comparisons++;
      highlightBars(i, i + 1, "red");
      await sleep(delay);
      await checkPause(pauseRef);
      if (array[i] > array[i + 1]) {
        swaps++;
        swap(array, i, i + 1);
        setArray([...array]);
        swapped = true;
      }
      resetBars(i, i + 1);
    }
    if (!swapped) break;

    end--;

    swapped = false;
    for (let i = end - 1; i > start; i--) {
      comparisons++;
      highlightBars(i, i - 1, "red");
      await sleep(delay);
      await checkPause(pauseRef);
      if (array[i] < array[i - 1]) {
        swaps++;
        swap(array, i, i - 1);
        setArray([...array]);
        swapped = true;
      }
      resetBars(i, i - 1);
    }
    start++;
    if (!swapped) break;
  }
  markSortedBars(array.length);
  setStats({ comparisons, swaps });
};

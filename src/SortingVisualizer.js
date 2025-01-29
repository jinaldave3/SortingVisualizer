import React, { useState, useRef } from 'react';
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  shellSort,
  cocktailShakerSort,
} from './SortingAlgorthms.js';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const pauseRef = useRef(false);

  const generateArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setStats({ comparisons: 0, swaps: 0 });
  };

  const togglePause = () => {
    if (!isSorting) return;
    setIsPaused(!isPaused);
    pauseRef.current = !pauseRef.current;
  };

  const startSorting = async (algorithm) => {
    if (isSorting) return;
    setIsSorting(true);
    setStats({ comparisons: 0, swaps: 0 });

    const delay = Math.max(1, 101 - speed);

    await algorithm([...array], setArray, setStats, delay, pauseRef);

    setIsSorting(false);
    setIsPaused(false);
    pauseRef.current = false;
  };

  const algorithms = [
    { name: 'Bubble Sort', function: bubbleSort },
    { name: 'Selection Sort', function: selectionSort },
    { name: 'Insertion Sort', function: insertionSort },
    { name: 'Merge Sort', function: mergeSort },
    { name: 'Quick Sort', function: quickSort },
    { name: 'Heap Sort', function: heapSort },
    { name: 'Counting Sort', function: countingSort },
    { name: 'Radix Sort', function: radixSort },
    { name: 'Shell Sort', function: shellSort },
    { name: 'Cocktail Shaker Sort', function: cocktailShakerSort },
  ];

  return (
    <div className="sorting-visualizer">
      <h1>Sorting Algorithms Visualizer</h1>

      {/* Controls */}
      <div className="controls">
        <button onClick={generateArray} disabled={isSorting}>
          Generate New Array
        </button>
        <input
          type="range"
          min="10"
          max="200"
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          disabled={isSorting}
        />
        <label>Array Size: {arraySize}</label>

        <input
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={isSorting}
        />
        <label>Speed: {speed}</label>

        <select
          onChange={(e) => startSorting(algorithms[e.target.value].function)}
          disabled={isSorting || array.length === 0}
        >
          <option value="">Select Algorithm</option>
          {algorithms.map((algo, index) => (
            <option key={index} value={index}>
              {algo.name}
            </option>
          ))}
        </select>

        <button onClick={togglePause} disabled={!isSorting}>
          {isPaused ? 'Resume Comparisons' : 'Pause Comparisons'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats">
        <p>Comparisons: {stats.comparisons}</p>
        <p>Swaps: {stats.swaps}</p>
      </div>

      {/* Visualization */}
      <div className="array-container">
        {array.map((value, index) => (
          <div
            className="array-bar"
            key={index}
            style={{
              height: `${value * 4}px`,
              width: `${500 / arraySize}px`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;

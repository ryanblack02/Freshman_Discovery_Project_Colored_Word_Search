const words = { /* same word list as you already have */ };

const gridSize = 12;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomChoice(arr) {
  return arr[getRandomInt(arr.length)];
}

function createEmptyGrid() {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
}

function fillEmptySpaces(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!grid[r][c]) grid[r][c] = alphabet[getRandomInt(alphabet.length)];
    }
  }
}

function placeWord(grid, word) {
  const direction = Math.random() < 0.5 ? "right" : "down";
  const len = word.length;
  let placed = false;

  while (!placed) {
    const row = getRandomInt(gridSize);
    const col = getRandomInt(gridSize);

    if (direction === "right" && col + len <= gridSize) {
      for (let i = 0; i < len; i++) grid[row][col + i] = word[i];
      placed = true;
    } else if (direction === "down" && row + len <= gridSize) {
      for (let i = 0; i < len; i++) grid[row + i][col] = word[i];
      placed = true;
    }
  }
}

function displayGrid(grid) {
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";

  grid.forEach(row => {
    row.forEach(letter => {
      const div = document.createElement("div");
      div.className = "cell";
      div.textContent = letter;
      gridDiv.appendChild(div);
    });
  });
}

function generateWordSearch() {
  const categories = Object.keys(words);
  const chosenCategory = randomChoice(categories);
  const difficulty = Math.random() < 0.5 ? "kid" : "adult";
  const selectedWords = words[chosenCategory][difficulty];

  const grid = createEmptyGrid();
  const numberOfWords = Math.min(6, selectedWords.length);

  selectedWords
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfWords)
    .forEach(word => placeWord(grid, word.toUpperCase()));

  fillEmptySpaces(grid);
  displayGrid(grid);

  // Show category for user
  document.getElementById("categoryLabel").textContent =
    `Category: ${chosenCategory.charAt(0).toUpperCase() + chosenCategory.slice(1)} – Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;

  console.log(`Generated category: ${chosenCategory}, difficulty: ${difficulty}`);
}

window.onload = generateWordSearch;

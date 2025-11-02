// --- Word List ---
const words = {
  mammals: {
    kid: ["Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
          "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
          "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel","Mouse","Rat",
          "Hedgehog","Bat","Raccoon"],
    adult: ["Aardvark","Aardwolf","Alpaca","Antelope","Bison","Capybara","Chimpanzee",
            "Cheetah","Dugong","Echidna","Fennecfox","Gerenuk","Hartebeest","Hyena",
            "Impala","Jackal","Koala","Lemur","Manatee","Meerkat","Moose","Narwhal",
            "Okapi","Platypus","Porcupine","Redpanda","Sloth","Tapir","Warthog",
            "Wolverine"]
  },
  birds: {
    kid: ["Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin",
          "Flamingo","Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan",
          "Woodpecker","Seagull","Pelican","Ostrich"],
    adult: ["Albatross","Cassowary","Cockatoo","Condor","Crane","Falcon","Heron",
            "Hornbill","Kingfisher","Kookaburra","Macaw","Nightingale","Quail",
            "Roadrunner","Shoebill"]
  }
  // ... other categories
};

// --- Utility Functions ---
function getRandomInt(max) { return Math.floor(Math.random() * max); }
function randomChoice(arr) { return arr[getRandomInt(arr.length)]; }

// --- Dynamic Grid Size Based on Longest Word ---
function getGridSize(words) {
  const maxWordLength = Math.max(...words.map(w => w.length));
  return Math.max(12, maxWordLength + 3); // minimum 12x12 grid
}

// --- Create Empty Grid ---
function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

// --- Fill Empty Spaces ---
function fillEmptySpaces(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid.length; c++)
      if (!grid[r][c]) grid[r][c] = alphabet[getRandomInt(alphabet.length)];
}

// --- Place Word in 8 Directions ---
function placeWord(grid, word) {
  const directions = [
    [0,1], [0,-1], [1,0], [-1,0],
    [1,1], [1,-1], [-1,1], [-1,-1]
  ];
  const size = grid.length;
  let placed = false;
  let attempts = 0;

  while (!placed && attempts < 200) {
    attempts++;
    const [dr, dc] = directions[getRandomInt(directions.length)];
    const row = getRandomInt(size);
    const col = getRandomInt(size);
    let fits = true;
    let positions = [];

    for (let i = 0; i < word.length; i++) {
      const r = row + dr*i;
      const c = col + dc*i;
      if (r<0 || r>=size || c<0 || c>=size) { fits=false; break; }
      const cell = grid[r][c];
      if (cell && cell !== word[i]) { fits=false; break; }
      positions.push([r,c]);
    }

    if (fits) {
      positions.forEach(([r,c],i)=>grid[r][c]=word[i]);
      placed = true;
    }
  }

  if (!placed) console.warn(`Could not place word: ${word}`);
}

// --- Display Grid ---
let cellElements = [];
function displayGrid(grid) {
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";
  gridDiv.style.gridTemplateColumns = `repeat(${grid.length}, 35px)`;
  cellElements = [];

  for (let r = 0; r < grid.length; r++) {
    const row = [];
    for (let c = 0; c < grid.length; c++) {
      const div = document.createElement("div");
      div.className = "cell";
      div.dataset.row = r;
      div.dataset.col = c;
      div.textContent = grid[r][c];
      gridDiv.appendChild(div);
      row.push(div);
    }
    cellElements.push(row);
  }
}

// --- Generate Word Search ---
function generateWordSearch() {
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  let selectedWords = words[category][difficulty].map(w => w.toUpperCase());
  selectedWords = selectedWords.sort(()=>0.5-Math.random()).slice(0,6); // pick 6 words

  const gridSize = getGridSize(selectedWords);
  const grid = createEmptyGrid(gridSize);

  selectedWords.forEach(word => placeWord(grid, word));
  fillEmptySpaces(grid);
  displayGrid(grid);

  // Display Word List
  document.getElementById("wordListContainer").innerHTML = "<strong>Words to Find:</strong> " + selectedWords.join(", ");
}

// --- Event Listener ---
document.getElementById("generateButton").addEventListener("click", generateWordSearch);
window.onload = generateWordSearch;

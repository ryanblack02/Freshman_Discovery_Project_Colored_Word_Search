// --- Full Word List ---
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
  },
  reptiles: {
    kid: ["Snake","Lizard","Crocodile","Alligator","Turtle","Tortoise","Chameleon","Gecko","Iguana","Komododragon"],
    adult: ["Anaconda","Basilisk","Boa","Gila","Monitor","Rattlesnake","Tuatara","Komododragon"]
  },
  amphibians: {
    kid: ["Frog","Toad","Salamander","Newt","Axolotl"],
    adult: ["Canetoad","Glassfrog","Firebelliedtoad","Olm","Surinamtoad"]
  },
  fish: {
    kid: ["Goldfish","Salmon","Tuna","Shark","Clownfish","Trout","Seahorse","Catfish","Angelfish","Swordfish"],
    adult: ["Anglerfish","Barracuda","Betta","Carp","Eel","Grouper","Guppy","Lionfish","Mahi","Marlin","Piranha"]
  },
  insects: {
    kid: ["Butterfly","Bee","Ant","Ladybug","Grasshopper","Dragonfly","Mosquito","Fly","Wasp","Beetle","Moth","Cricket"],
    adult: ["Atlasmoth","Cicada","Damselfly","Goliathbeetle","Mantis","Scorpion","Tarantula","Walkingstick"]
  },
  invertebrates: {
    kid: ["Crab","Lobster","Shrimp","Jellyfish","Starfish","Octopus","Squid","Clam","Snail","Spider"],
    adult: ["Horseshoecrab","Mantis","Nudibranch","Sealion","Walrus","Yabby"]
  }
};

// --- Grid Settings ---
const gridSize = 12;

// --- Utility Functions ---
function getRandomInt(max) { return Math.floor(Math.random() * max); }
function randomChoice(arr) { return arr[getRandomInt(arr.length)]; }
function createEmptyGrid() { return Array.from({ length: gridSize }, () => Array(gridSize).fill("")); }
function fillEmptySpaces(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++)
    for (let c = 0; c < gridSize; c++)
      if (!grid[r][c]) grid[r][c] = alphabet[getRandomInt(alphabet.length)];
}

// --- Place Words in 8 Directions ---
function placeWord(grid, word) {
  const directions = [
    "right","left","down","up",
    "diagDownRight","diagDownLeft","diagUpRight","diagUpLeft"
  ];
  const len = word.length;
  let placed = false, attempts = 0, maxAttempts = 100;

  while (!placed && attempts < maxAttempts) {
    attempts++;
    const direction = directions[getRandomInt(directions.length)];
    const row = getRandomInt(gridSize);
    const col = getRandomInt(gridSize);
    let fits = true;
    let positions = [];

    for (let i = 0; i < len; i++) {
      let r = row, c = col;
      switch(direction){
        case "right": c+=i; break;
        case "left": c-=i; break;
        case "down": r+=i; break;
        case "up": r-=i; break;
        case "diagDownRight": r+=i;c+=i; break;
        case "diagDownLeft": r+=i;c-=i; break;
        case "diagUpRight": r-=i;c+=i; break;
        case "diagUpLeft": r-=i;c-=i; break;
      }
      if(r<0||r>=gridSize||c<0||c>=gridSize){ fits=false; break; }
      positions.push([r,c]);
    }

    if(fits){ positions.forEach(([r,c],i)=>grid[r][c]=word[i]); placed=true; }
  }

  if(!placed) console.warn(`Could not place word: ${word}`);
}

// --- Display Grid ---
let cellElements = [];
function displayGrid(grid){
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";
  gridDiv.style.gridTemplateColumns = `repeat(${gridSize}, 35px)`;
  cellElements = [];

  for (let r = 0; r < gridSize; r++) {
    const row = [];
    for (let c = 0; c < gridSize; c++) {
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

// --- Highlighting Setup ---
let isDragging = false;
let startCell = null;
let endCell = null;
let chosenWords = [];
let foundWords = new Set();

function onCellDown(e) {
  isDragging = true;
  startCell = e.target;
  clearSelection();
}

function onCellUp(e) {
  if (!isDragging || !startCell) return;
  isDragging = false;
  endCell = e.target;

  const word = getSelectedWord(startCell, endCell);
  if (word && chosenWords.includes(word)) {
    foundWords.add(word);
    highlightSelection(startCell, endCell, "#90ee90");
  }
}

function getSelectedWord(start, end) {
  const sr = parseInt(start.dataset.row);
  const sc = parseInt(start.dataset.col);
  const er = parseInt(end.dataset.row);
  const ec = parseInt(end.dataset.col);
  let dr = Math.sign(er - sr);
  let dc = Math.sign(ec - sc);
  let r = sr, c = sc, letters = "";

  while (r >= 0 && c >= 0 && r < gridSize && c < gridSize) {
    letters += cellElements[r][c].textContent;
    if (r === er && c === ec) break;
    r += dr; c += dc;
  }
  return letters;
}

function clearSelection() {
  cellElements.flat().forEach(cell => cell.style.backgroundColor = "");
}

function highlightSelection(start, end, color) {
  const sr = parseInt(start.dataset.row);
  const sc = parseInt(start.dataset.col);
  const er = parseInt(end.dataset.row);
  const ec = parseInt(end.dataset.col);
  let dr = Math.sign(er - sr);
  let dc = Math.sign(ec - sc);
  let r = sr, c = sc;

  while (r >= 0 && c >= 0 && r < gridSize && c < gridSize) {
    cellElements[r][c].style.backgroundColor = color;
    if (r === er && c === ec) break;
    r += dr; c += dc;
  }
}

// --- Main Function with Button Safety ---
let generating = false;
function generateWordSearch(){
  if(generating) return;
  generating = true;

  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  let selectedWords = words[category][difficulty];

  const grid = createEmptyGrid();
  const numberOfWords = Math.min(6, selectedWords.length);
  chosenWords = selectedWords.sort(()=>0.5 - Math.random()).slice(0, numberOfWords).map(w => w.toUpperCase());

  chosenWords.forEach(word=>placeWord(grid, word));
  fillEmptySpaces(grid);
  displayGrid(grid);

  // Update labels
  document.getElementById("categoryLabel").textContent = 
    `Category: ${category.charAt(0).toUpperCase()+category.slice(1)} – Difficulty: ${difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}`;

  document.getElementById("wordListContainer").innerHTML = 
    "<strong>Words in this puzzle:</strong> " + chosenWords.join(", ");

  // Attach highlighting listeners
  document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("mousedown", onCellDown);
    cell.addEventListener("mouseup", onCellUp);
  });

  generating = false;
}

// --- Event Listener ---
document.getElementById("generateButton").addEventListener("click", generateWordSearch);
window.onload = generateWordSearch;

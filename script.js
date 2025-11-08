/* ------------------------------
   🧩 Global Variables
------------------------------ */
let currentGrid = null;
let gridContainer = null;
let isPointerDown = false;
let pointerStart = null;
let pointerLast = null;
let chosenWords = [];

/* ------------------------------
   🐾 Word Database
------------------------------ */
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
    kid: ["Snake","Lizard","Turtle","Crocodile","Alligator","Chameleon","Gecko","Iguana"],
    adult: ["Komododragon","GarterSnake","Boa","Python","Anole","Tortoise","Monitor"]
  },
  amphibians: {
    kid: ["Frog","Toad","Salamander","Newt"],
    adult: ["Axolotl","Caecilian"]
  },
  fish: {
    kid: ["Goldfish","Shark","Tuna","Trout","Salmon","Clownfish","Catfish"],
    adult: ["Barracuda","Grouper","Swordfish","Anglerfish","Lionfish","Betta","Piranha"]
  },
  insects: {
    kid: ["Ant","Bee","Butterfly","Beetle","Fly","Wasp","Grasshopper","Ladybug"],
    adult: ["Dragonfly","Cricket","Termite","Moth","Mosquito","PrayingMantis"]
  },
  invertebrates: {
    kid: ["Snail","Worm","Jellyfish","Crab","Octopus","Starfish"],
    adult: ["Lobster","Scorpion","Coral","Anemone","Cuttlefish"]
  }
};

/* ------------------------------
   🎯 Generate Word Search Grid
------------------------------ */
function generateWordSearch() {
  const size = 14; // 14x14 grid
  const grid = Array.from({ length: size }, () => Array(size).fill(""));

  // Flatten all words into one big array (can change difficulty here)
  const allAnimals = Object.values(words)
    .flatMap(group => [...group.kid, ...group.adult])
    .map(w => w.toUpperCase());

  chosenWords = [];
  while (chosenWords.length < 10) {
    const randomWord = allAnimals[Math.floor(Math.random() * allAnimals.length)];
    if (!chosenWords.includes(randomWord) && randomWord.length <= size)
      chosenWords.push(randomWord);
  }

  chosenWords.forEach(word => placeWordInGrid(word, grid));

  // Fill empty spaces with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "")
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }

  drawGrid(grid);
  showWordList();
  enableInteraction(grid);
}

/* ------------------------------
   📦 Place Word in Grid
------------------------------ */
function placeWordInGrid(word, grid) {
  const directions = [
    [0, 1], [1, 0], [1, 1],
    [0, -1], [-1, 0], [-1, -1],
    [1, -1], [-1, 1]
  ];
  const size = grid.length;

  for (let attempt = 0; attempt < 100; attempt++) {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    const endRow = row + dir[0] * (word.length - 1);
    const endCol = col + dir[1] * (word.length - 1);

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dir[0] * i;
      const c = col + dir[1] * i;
      if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
        fits = false;
        break;
      }
    }

    if (fits) {
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        grid[r][c] = word[i];
      }
      return;
    }
  }
}

/* ------------------------------
   🎨 Draw Grid
------------------------------ */
function drawGrid(grid) {
  const container = document.getElementById("grid");
  container.innerHTML = "";
  grid.forEach(row => {
    row.forEach(letter => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = letter;
      container.appendChild(cell);
    });
  });
}

/* ------------------------------
   📝 Word List Display
------------------------------ */
function showWordList() {
  const list = document.getElementById("wordList");
  list.innerHTML = "";
  chosenWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  });
}

/* ------------------------------
   ✋ Pointer + Highlight Logic
------------------------------ */
window.addEventListener("mousedown", pointerDown);
window.addEventListener("mousemove", pointerMove);
window.addEventListener("mouseup", pointerUp);
window.addEventListener("touchstart", pointerDown, { passive: false });
window.addEventListener("touchmove", pointerMove, { passive: false });
window.addEventListener("touchend", pointerUp);

function getPointer(e) {
  return e.touches ? e.touches[0] : e;
}

function getCellFromPoint(x, y) {
  if (!gridContainer || !currentGrid) return null;
  const rect = gridContainer.getBoundingClientRect();
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
  const cw = rect.width / currentGrid.length;
  const ch = rect.height / currentGrid.length;
  return [
    Math.min(currentGrid.length - 1, Math.floor((y - rect.top) / ch)),
    Math.min(currentGrid.length - 1, Math.floor((x - rect.left) / cw))
  ];
}

function pointerDown(e) {
  if (!currentGrid) return;
  isPointerDown = true;
  const p = getPointer(e);
  pointerStart = getCellFromPoint(p.clientX, p.clientY);
  pointerLast = pointerStart;
  if (pointerStart) showTemp(...pointerStart, ...pointerStart);
}

function pointerMove(e) {
  if (!isPointerDown || !currentGrid) return;
  const p = getPointer(e);
  const c = getCellFromPoint(p.clientX, p.clientY);
  if (c) {
    pointerLast = c;
    showTemp(...pointerStart, ...pointerLast);
  }
}

function pointerUp(e) {
  if (!isPointerDown || !currentGrid) return;
  isPointerDown = false;
  if (pointerStart && pointerLast) {
    const w = getPathWord(...pointerStart, ...pointerLast, currentGrid);
    const rev = w.split("").reverse().join("");
    if (chosenWords.includes(w))
      markWordFound(w, ...pointerStart, ...pointerLast);
    else if (chosenWords.includes(rev))
      markWordFound(rev, ...pointerStart, ...pointerLast);
  }
  clearTemp();
  pointerStart = null;
  pointerLast = null;
}

/* ------------------------------
   🔄 Interaction for New Grid
------------------------------ */
function enableInteraction(grid) {
  currentGrid = grid;
  gridContainer = document.getElementById("grid");
}

/* ------------------------------
   🧮 Helper Functions
------------------------------ */
function getPathWord(r1, c1, r2, c2, grid) {
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  let word = "";
  let r = r1, c = c1;
  while (true) {
    word += grid[r][c];
    if (r === r2 && c === c2) break;
    r += dr;
    c += dc;
  }
  return word;
}

function showTemp(r1, c1, r2, c2) {
  clearTemp();
  const cells = document.querySelectorAll(".cell");
  const size = currentGrid.length;
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  let r = r1, c = c1;
  while (true) {
    const index = r * size + c;
    cells[index].classList.add("temp");
    if (r === r2 && c === c2) break;
    r += dr;
    c += dc;
  }
}

function clearTemp() {
  document.querySelectorAll(".temp").forEach(el => el.classList.remove("temp"));
}

function markWordFound(word, r1, c1, r2, c2) {
  const listItems = document.querySelectorAll("#wordList li");
  listItems.forEach(li => {
    if (li.textContent === word) li.classList.add("found");
  });
  const cells = document.querySelectorAll(".cell");
  const size = currentGrid.length;
  const dr = Math.sign(r2 - r1);
  const dc = Math.sign(c2 - c1);
  let r = r1, c = c1;
  while (true) {
    const index = r * size + c;
    cells[index].classList.add("found");
    if (r === r2 && c === c2) break;
    r += dr;
    c += dc;
  }
}

/* ------------------------------
   🚀 Initialize
------------------------------ */
document.getElementById("newPuzzle").addEventListener("click", generateWordSearch);
generateWordSearch();

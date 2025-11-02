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
  }
  // ... Add other categories as needed
};

// --- Utility Functions ---
function getRandomInt(max) { return Math.floor(Math.random() * max); }
function randomChoice(arr) { return arr[getRandomInt(arr.length)]; }
function createEmptyGrid(size) { return Array.from({ length: size }, () => Array(size).fill("")); }
function fillEmptySpaces(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (!grid[r][c]) grid[r][c] = alphabet[getRandomInt(alphabet.length)];
}

// --- Place Words in 8 Directions ---
function placeWord(grid, word) {
  const directions = [
    "right","left","down","up",
    "diagDownRight","diagDownLeft","diagUpRight","diagUpLeft"
  ];
  const len = word.length;
  let placed = false;

  while (!placed) { // keep trying until the word is placed
    const direction = randomChoice(directions);
    const row = getRandomInt(grid.length);
    const col = getRandomInt(grid[0].length);
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
      if(r<0||r>=grid.length||c<0||c>=grid[0].length) { fits=false; break; }
      if(grid[r][c] && grid[r][c] !== word[i]) { fits=false; break; }
      positions.push([r,c]);
    }

    if(fits) {
      positions.forEach(([r,c],i)=>grid[r][c]=word[i]);
      placed = true;
    }
  }
}

// --- Display Grid ---
function displayGrid(grid){
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";
  gridDiv.style.gridTemplateColumns = `repeat(${grid[0].length}, 35px)`;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const div = document.createElement("div");
      div.className = "cell";
      div.textContent = grid[r][c];
      gridDiv.appendChild(div);
    }
  }
}

// --- Main Function ---
function generateWordSearch(){
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  const selectedWords = words[category][difficulty];

  const numberOfWords = Math.min(6, selectedWords.length);
  const chosenWords = selectedWords.sort(()=>0.5 - Math.random()).slice(0, numberOfWords).map(w => w.toUpperCase());

  // Determine dynamic grid size based on the longest word + extra space
  const longestWordLength = Math.max(...chosenWords.map(w => w.length));
  const gridSize = Math.max(longestWordLength + 4, 12); // min 12, plus extra space

  const grid = createEmptyGrid(gridSize);
  chosenWords.forEach(word => placeWord(grid, word));
  fillEmptySpaces(grid);
  displayGrid(grid);

  // Show word list below grid
  document.getElementById("wordListContainer").innerHTML =
    "<strong>Words in this puzzle:</strong> " + chosenWords.join(", ");
}

// --- Event Listener ---
document.getElementById("generateButton").addEventListener("click", generateWordSearch);
window.onload = generateWordSearch;

// --- Full Word List Organized by Category & Difficulty ---
const words = {
  mammals: {
    kid: ["Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
      "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
      "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel","Mouse","Rat",
      "Hedgehog","Bat","Raccoon"],
    adult: ["Aardvark","Aardwolf","Alpaca","Antelope","Bison","Capybara","Chimpanzee",
      "Cheetah","Dugong","Echidna","Fennec fox","Gerenuk","Hartebeest","Hyena",
      "Impala","Jackal","Koala","Lemur","Manatee","Meerkat","Moose","Narwhal",
      "Okapi","Platypus","Porcupine","Red panda","Sloth","Tapir","Warthog",
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
    kid: ["Snake","Lizard","Crocodile","Alligator","Turtle","Tortoise","Chameleon","Gecko","Iguana","Komodo dragon"],
    adult: ["Anaconda","Basilisk","Boa","Gila","Monitor","Rattlesnake","Tuatara","Komodo dragon"]
  },
  amphibians: {
    kid: ["Frog","Toad","Salamander","Newt","Axolotl"],
    adult: ["Cane toad","Glass frog","Fire-bellied toad","Olm","Surinam toad"]
  },
  fish: {
    kid: ["Goldfish","Salmon","Tuna","Shark","Clownfish","Trout","Seahorse","Catfish","Angelfish","Swordfish"],
    adult: ["Anglerfish","Barracuda","Betta","Carp","Eel","Grouper","Guppy","Lionfish","Mahi","Marlin","Piranha"]
  },
  insects: {
    kid: ["Butterfly","Bee","Ant","Ladybug","Grasshopper","Dragonfly","Mosquito","Fly","Wasp","Beetle","Moth","Cricket"],
    adult: ["Atlas moth","Cicada","Damselfly","Goliath beetle","Mantis","Scorpion","Tarantula","Walking stick"]
  },
  invertebrates: {
    kid: ["Crab","Lobster","Shrimp","Jellyfish","Starfish","Octopus","Squid","Clam","Snail","Spider"],
    adult: ["Horseshoe crab","Mantis","Nudibranch","Sea lion","Walrus","Yabby"]
  }
};

const gridSize = 12;

// --- Utility Functions ---
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
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
  const directions = [
    "right", "left", "down", "up",
    "diagDownRight", "diagDownLeft", "diagUpRight", "diagUpLeft"
  ];

  const len = word.length;
  let placed = false;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  while (!placed && attempts < maxAttempts) {
    attempts++;
    const direction = directions[getRandomInt(directions.length)];
    const row = getRandomInt(gridSize);
    const col = getRandomInt(gridSize);

    let fits = true;
    let positions = [];

    // Compute positions based on direction
    for (let i = 0; i < len; i++) {
      let r = row, c = col;

      switch (direction) {
        case "right": c += i; break;
        case "left": c -= i; break;
        case "down": r += i; break;
        case "up": r -= i; break;
        case "diagDownRight": r += i; c += i; break;
        case "diagDownLeft": r += i; c -= i; break;
        case "diagUpRight": r -= i; c += i; break;
        case "diagUpLeft": r -= i; c -= i; break;
      }

      // Check boundaries
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
        fits = false;
        break;
      }
      positions.push([r, c]);
    }

    if (fits) {
      // Place the word
      positions.forEach(([r, c], i) => grid[r][c] = word[i]);
      placed = true;
    }
  }

  if (!placed) console.warn(`Could not place word: ${word}`);
}

function generateWordSearch() {
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  let selectedWords = words[category][difficulty];

  // Filter words longer than grid
  selectedWords = selectedWords.filter(word => word.length <= gridSize);

  const grid = createEmptyGrid();
  const numberOfWords = Math.min(6, selectedWords.length);

  selectedWords
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfWords)
    .forEach(word => placeWord(grid, word.toUpperCase()));

  fillEmptySpaces(grid);
  displayGrid(grid);

  document.getElementById("categoryLabel").textContent =
    `Category: ${category.charAt(0).toUpperCase() + category.slice(1)} – Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;
}

// Attach button event
document.getElementById("generateButton").addEventListener("click", generateWordSearch);

// Generate initial grid on page load
window.onload = generateWordSearch;

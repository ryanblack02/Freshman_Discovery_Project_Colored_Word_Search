// --- Full Word List Organized by Category & Difficulty ---
const words = {
  mammals: {
    kid: ["Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
      "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
      "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel","Mouse","Rat",
      "Hedgehog","Bat","Raccoon"
    ],
    adult: ["Aardvark","Aardwolf","Alpaca","Antelope","Bison","Capybara","Chimpanzee",
      "Cheetah","Dugong","Echidna","Fennecfox","Gerenuk","Hartebeest","Hyena",
      "Impala","Jackal","Koala","Lemur","Manatee","Meerkat","Moose","Narwhal",
      "Okapi","Platypus","Porcupine","Redpanda","Sloth","Tapir","Warthog",
      "Wolverine"
    ]
  },
  birds: {
    kid: ["Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin",
      "Flamingo","Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan",
      "Woodpecker","Seagull","Pelican","Ostrich"
    ],
    adult: ["Albatross","Cassowary","Cockatoo","Condor","Crane","Falcon","Heron",
      "Hornbill","Kingfisher","Kookaburra","Macaw","Nightingale","Quail",
      "Roadrunner","Shoebill"
    ]
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

// --- Word Search Settings ---
const gridSize = 12;

// --- Utility Functions ---
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
      if (!grid[r][c]) {
        grid[r][c] = alphabet[getRandomInt(alphabet.length)];
      }
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

  grid.flat().forEach(letter => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = letter;
    gridDiv.appendChild(div);
  });
}

// --- Main Function ---
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
  console.log(`Generated category: ${chosenCategory}, difficulty: ${difficulty}`);
}

window.onload = generateWordSearch;

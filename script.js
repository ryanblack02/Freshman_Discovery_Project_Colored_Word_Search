// Full 200-word list organized by category and difficulty
const words = {
  mammals: {
    kid: [
      "Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
      "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
      "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel","Mouse","Rat",
      "Hedgehog","Bat","Raccoon"
    ],
    adult: [
      "Aardvark","Aardwolf","Alpaca","Antelope","Bison","Capybara","Chimpanzee",
      "Cheetah","Dugong","Echidna","Fennecfox","Gerenuk","Hartebeest","Hyena",
      "Impala","Jackal","Koala","Lemur","Manatee","Meerkat","Moose","Narwhal",
      "Okapi","Platypus","Porcupine","Redpanda","Sloth","Tapir","Warthog",
      "Wolverine"
    ]
  },
  birds: {
    kid: [
      "Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin",
      "Flamingo","Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan",
      "Woodpecker","Seagull","Pelican","Ostrich"
    ],
    adult: [
      "Albatross","Cassowary","Cockatoo","Condor","Crane","Falcon","Heron",
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

// Show words for testing (Week 3 feature)
function displayWords() {
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  const wordList = words[category] && words[category][difficulty];

  const wordContainer = document.getElementById("wordContainer");
  wordContainer.innerHTML = ""; // Clear previous content

  if (wordList) {
    const list = document.createElement("ul");
    wordList.forEach(word => {
      const listItem = document.createElement("li");
      listItem.textContent = word;
      list.appendChild(listItem);
    });
    wordContainer.appendChild(list);
  } else {
    wordContainer.textContent = "No words available for the selected category and difficulty.";
  }
}
document.getElementById("showWordsButton").addEventListener("click", displayWords);

// -------------------------
// WEEK 4 GRID GENERATOR
// -------------------------
const gridSize = 12;

function createEmptyGrid() {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function placeWord(grid, word) {
  const directions = ["right", "down"];
  const direction = directions[Math.floor(Math.random() * directions.length)];

  for (let attempt = 0; attempt < 100; attempt++) {
    let row = getRandomInt(gridSize);
    let col = getRandomInt(gridSize);

    if (direction === "right") {
      if (col + word.length > gridSize) continue;
      if (grid[row].slice(col, col + word.length).some(cell => cell !== "")) continue;
      for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
      return true;
    }

    if (direction === "down") {
      if (row + word.length > gridSize) continue;
      if (grid.slice(row, row + word.length).some(r => r[col] !== "")) continue;
      for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
      return true;
    }
  }
  return false;
}

function displayGrid(grid) {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("grid-table");

  grid.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell === "" ? "" : cell.toUpperCase();
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  gridContainer.appendChild(table);
}

function generateGrid() {
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;
  const selectedWords = words[category][difficulty];
  if (!selectedWords) return;

  const numberOfWords = Math.min(5 + getRandomInt(4), selectedWords.length);
  const chosenWords = selectedWords.sort(() => 0.5 - Math.random()).slice(0, numberOfWords);

  const grid = createEmptyGrid();
  chosenWords.forEach(word => placeWord(grid, word.toUpperCase()));
  displayGrid(grid);

  document.getElementById("wordList").textContent = "Words: " + chosenWords.join(", ");
  document.getElementById("generateGridButton").addEventListener("click", generateGrid);

}

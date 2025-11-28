/* Animal Word Search — script.js
   - Confetti (canvas-confetti) triggers on completion
   - Congrats banner stays until the user generates a new grid
   - Works for initial auto-grid and any user-generated grid
*/

const words = {
  mammals: {
    kid: ["Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger","Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer","Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel"],
    adult: ["Aardvark","Aardwolf","Alpaca","Antelope","Baboon","Badger","Bison","Bobcat","Capybara","Caribou","Civet","Coyote","Dugong","Eland","Echidna","Ermine","FennecFox","Ferret","Gazelle","Gerenuk","Gibbon","Goral","Groundhog","Hedgehog","Hippopotamus","Hyaena","Ibex","Impala","Jackal","Jaguar","Kakapo","KangarooRat","Kinkajou","Koala","Kudu","Lemur","Lynx","Manatee","Marten","Meerkat","Mongoose","Moose","Muskox","Narwhal","Numbat","Ocelot","Okapi","Orangutan","OtterSea","Pangolin","Peccary","Pika","Platypus","Porcupine","PrairieDog","ProboscisMonkey","Pronghorn","Puma","Quokka","Quoll","Raccoon","Reindeer","RedPanda","RestlessOne","Ringtail","SeaLion","Serval","Shearwater","Shrew","SlowLoris","SpermWhale","SableAntelope","Sifaka","Skunk","Sloth","Stoat","Tapir","TasmanianDevil","Tamarin","TigerShark","Vervet","Vicuna","Warthog","WaterBuffalo","Weasel","Wolverine","Yak","Zorilla"]
  },
  birds: {
    kid: ["Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin","Flamingo","Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan","Woodpecker","Seagull","Pelican","Ostrich","Dove","Pigeon","Turkey","Condor","Stork"],
    adult: ["Albatross","Anhinga","Avocet","BaldEagle","BarnOwl","BarnSwallow","Bittern","Bowerbird","Budgerigar","Buzzard","Cacique","Canary","Cassowary","Cockatoo","Cormorant","Crane","Cuckoo","Curlew","DoveTanager","Dovekie","Drongo","Dunlin","Eider","Egret","Emu","Falcon","Firefinch","Flycatcher","Gannet","Goldfinch","Goshawk","Grebe","Grossbeak","Grouse","Guineafowl","Gull","Harrier","Heron","Honeycreeper","Hoopoe","Hornbill","Ibis","Jacana","Junco","Kestrel","Ketupa","Kingfisher","Kite","Kookaburra","Lapwing","Lark","Lyrebird","Magpie","Marabou","Myna","Nightingale","Nuthatch","Osprey","Oystercatcher","Parakeet","Parrotlet","Petrel","Plover","Ptarmigan","Quail","Rail","Raven","Roadrunner","RosyFinch","Rook","Sandpiper","Spoonbill","Stilt","Sunbird","SwanGoose","Tern","Turnstone","Vireo","Vulture","Warbler","Waxwing","Wryneck"]
  },
  reptiles: {
    kid: ["Snake","Lizard","Turtle","Crocodile","Alligator","Chameleon","Gecko","Iguana","Tortoise","Skink","Anole","GarterSnake","Copperhead"],
    adult: ["KomodoDragon","Boa","Python","Monitor","Basilisk","Viper","Mamba","Taipan","GilaMonster","Rattlesnake","Copperhead","CoralSnake","KingCobra","WaterPython","GreenAnaconda","GlassLizard","HornedLizard","BeardedDragon","Adder","LeopardTortoise","GalapagosTortoise","DesertTortoise","AmericanAlligator","SaltwaterCrocodile","SpectacledCaiman","CrocodileMonitor","FlyingDragon","SeaSnake","BandedKrait","BlackMamba","BushSnake","Coachwhip","CopperbellySalamander","Diamondback","EasternTigerSnake","FenceLizard","GarterSnake","HornedViper","IndianPython","JavelinLizard","KingRatSnake","LeafNosedGecko","MexicanBeadedLizard","NightLizard","OliveRidley","PlainsGarter","QuinceMonitor","RedTailedBoa","Scheltopusik","TreeBoa","Uromastyx","ViperBoa","WaterMonitor","YellowAnaconda","Zebra-tailedLizard"]
  },
  amphibians: {
    kid: ["Frog","Toad","Salamander","Newt","TreeFrog","Bullfrog","Mudpuppy","Tadpole","Axolotl","GlassFrog"],
    adult: ["Caecilian","Hellbender","Sirens","Olm","TigerSalamander","FireSalamander","GiantSalamander","PoisonDartFrog","GlassFrogSpecies","MarshFrog","PickerelFrog","RedEft","SpadefootToad","WoodFrog","DarwinFrog","CommonToad","EuropeanNewt","OliveToad","CaneToad","Salamandra","GiantClawedFrog","SurinamToad","HoodedFrog","AfricanClawedFrog","BorealToad","NatterjackToad","MoorFrog","TomatoFrog","FireBelliedToad","MidwifeToad","SmoothNewt","YellowBelliedToad","EasternNewt","Ambystoma","TigerSalamanderSp"]
  },
  fish: {
    kid: ["Goldfish","Shark","Tuna","Trout","Salmon","Clownfish","Catfish","MantaRay","Angelfish","Guppy","Seahorse","Stingray","Carp","Pufferfish","Perch"],
    adult: ["Barracuda","Grouper","Swordfish","Anglerfish","Lionfish","Betta","Piranha","Marlin","Sturgeon","Snapper","Halibut","Mackerel","Wahoo","Tarpon","Coelacanth","ElectricEel","BluefinTuna","AtlanticCod","PacificHerring","Yellowtail","Kingfish","Bonefish","Archerfish","Bichir","Blowfish","BroadaxeGurnard","Butterfish","Carp","ChannelCatfish","Cusk","Dogfish","Dorado","Dory","Eelpout","Flounder","Garfish","Goby","Hake","Herring","JackCrevalle","JohnDory","Lamprey","Lizardfish","MahiMahi","Monkfish","MorayEel","Needlefish","NorthernPike","OrangeRoughy","Parrotfish","Pilotfish","Pollock","Pomfret","Pompano","Puffer","RibbonFish","Sailfish","Sculpin","Shad","Skate","Smelt","Sole","Sunfish","Tilapia","Toadfish","Triggerfish","Weakfish","Whitefish","Wrasse","YellowfinTuna"]
  },
  insects: {
    kid: ["Ant","Bee","Butterfly","Beetle","Fly","Wasp","Grasshopper","Ladybug","Firefly","Caterpillar","Dragonfly","Moth","Cricket","Honeybee","Bumblebee"],
    adult: ["Aphid","AssassinBug","AtlasMoth","BarkBeetle","BeeEater","BombardierBeetle","BoxElderBug","CarpenterAnt","Cicada","ClickBeetle","Cockroach","Cranefly","DamselFly","Dobsonfly","Earwig","Flea","FruitFly","GiantWaterBug","Gnat","GrasshopperSp","GreenJuneBeetle","GroundBeetle","Hopper","Ichneumon","JuneBug","Katydid","LeafInsect","LeafcutterAnt","Locust","Louse","Mantid","Mayfly","MoleCricket","NetWing","QueenBee","RoveBeetle","Sawfly","ScorpionFly","Silkworm","SoldierBeetle","StinkBug","Stonefly","Termite","Thrips","TigerBeetle","Treehopper","Vespid","Weevil","Whirligig","Yellowjacket","Zoraptera"]
  },
  invertebrates: {
    kid: ["Snail","Worm","Jellyfish","Crab","Octopus","Starfish","Clam","Shrimp","SeaUrchin","Sponge","Lobster","Slug","Scallop"],
    adult: ["Abalone","Anemone","Barnacle","BrittleStar","Buccinoid","Cuttlefish","Cymothoid","Cymothoa","CrownOfThorns","Ctenophore","DungenessCrab","FeatherDusterWorm","Flatworm","GiantClam","GhostCrab","Gorgonian","HermitCrab","HorseshoeCrab","Isopod","Krill","Leech","LionManeJellyfish","Limpet","LobsterSp","MantisShrimp","MoonJelly","Nautilus","Octocoral","PenaeidPrawn","PearlOyster","PortugueseManOWar","SeaAnemone","SeaCucumber","SeaFan","SeaSlater","SeaSquirt","SeaWasp","ShrimpCleaner","Siphonophore","SpinyLobster","SquatLobster","Squid","TarantulaSeaAnemone","TubeWorm","VampireSquid","VelvetWorm","VenusComb","Whelk","Woodlouse","Zooplankton"]
  }
};

/* --------------------------------------------------
   Global State
-------------------------------------------------- */
let gridSize = 12;
let currentCategory = "mammals";
let currentDifficulty = "kid";
let wordsToPlace = [];
let placedWords = [];

let isMouseDown = false;
let startCell = null;
let selectedCells = [];

const directions = [
  { r: 0, c: 1 },
  { r: 0, c: -1 },
  { r: 1, c: 0 },
  { r: -1, c: 0 },
  { r: 1, c: 1 },
  { r: 1, c: -1 },
  { r: -1, c: 1 },
  { r: -1, c: -1 }
];

/* --------------------------------------------------
   Generate Word Search
-------------------------------------------------- */
function generateWordSearch() {
  clearGrid();
  placedWords = [];
  selectedCells = [];

  currentCategory = document.getElementById("categoryDropdown").value;
  currentDifficulty = document.getElementById("difficultyDropdown").value;

  wordsToPlace = pickWords(currentCategory, currentDifficulty);
  updateWordListUI(wordsToPlace);

  const gridData = createEmptyGrid(gridSize);
  placeAllWords(gridData);
  fillRandomLetters(gridData);
  renderGrid(gridData);

  updateCategoryLabel();
}

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */
function updateCategoryLabel() {
  const label = document.getElementById("categoryLabel");
  label.textContent = `Category: ${currentCategory} | Difficulty: ${currentDifficulty}`;
}

function pickWords(cat, diff) {
  const list = [...wordBank[cat]];
  return diff === "kid" ? list.slice(0, 6) : list;
}

function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function clearGrid() {
  document.getElementById("grid").innerHTML = "";
}

function fillRandomLetters(grid) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

/* --------------------------------------------------
   Word Placement
-------------------------------------------------- */
function placeAllWords(grid) {
  for (const word of wordsToPlace) {
    placeSingleWord(grid, word.toUpperCase());
  }
}

function placeSingleWord(grid, word) {
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const row = Math.floor(Math.random() * grid.length);
    const col = Math.floor(Math.random() * grid.length);

    if (canPlaceWord(grid, word, row, col, direction)) {
      writeWord(grid, word, row, col, direction);
      placedWords.push(word);
      return;
    }
  }
}

function canPlaceWord(grid, word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir.r * i;
    const c = col + dir.c * i;

    if (r < 0 || r >= grid.length || c < 0 || c >= grid.length) return false;
    if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function writeWord(grid, word, row, col, dir) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir.r * i;
    const c = col + dir.c * i;
    grid[r][c] = word[i];
  }
}

/* --------------------------------------------------
   UI Rendering
-------------------------------------------------- */
function updateWordListUI(words) {
  const container = document.getElementById("wordListContainer");
  container.innerHTML = `<strong>Words to Find:</strong><br />`;
  words.forEach(w => {
    const span = document.createElement("span");
    span.className = "word-to-find";
    span.textContent = w.toUpperCase();
    container.appendChild(span);
    container.appendChild(document.createElement("br"));
  });
}

function renderGrid(grid) {
  const gridEl = document.getElementById("grid");

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = grid[r][c];
      gridEl.appendChild(cell);
    }
  }
}

/* --------------------------------------------------
   Interaction
-------------------------------------------------- */
function initInteractionHandlers() {
  const gridEl = document.getElementById("grid");

  gridEl.addEventListener("mousedown", startSelect);
  gridEl.addEventListener("mouseover", continueSelect);
  document.addEventListener("mouseup", endSelect);

  gridEl.addEventListener("touchstart", startSelect);
  gridEl.addEventListener("touchmove", continueSelect);
  document.addEventListener("touchend", endSelect);
}

function startSelect(e) {
  const cell = getCellFromEvent(e);
  if (!cell) return;

  isMouseDown = true;
  startCell = cell;

  selectedCells = [cell];
  cell.classList.add("highlighting");
}

function continueSelect(e) {
  if (!isMouseDown) return;

  const cell = getCellFromEvent(e);
  if (!cell || selectedCells.includes(cell)) return;

  const last = selectedCells[selectedCells.length - 1];
  const dir = getDirection(last, cell);

  if (!dir) return;

  cell.classList.add("highlighting");
  selectedCells.push(cell);
}

function endSelect() {
  if (!isMouseDown) return;

  const word = selectedCells.map(c => c.textContent).join("");
  const reversed = selectedCells.map(c => c.textContent).reverse().join("");

  let matchedWord = null;

  for (const w of wordsToPlace.map(x => x.toUpperCase())) {
    if (word === w || reversed === w) {
      matchedWord = w;
      break;
    }
  }

  if (matchedWord) {
    lockWord(selectedCells, matchedWord);
    checkWin();
  } else {
    selectedCells.forEach(c => c.classList.remove("highlighting"));
  }

  isMouseDown = false;
  selectedCells = [];
}

function lockWord(cells, word) {
  cells.forEach(c => {
    c.classList.remove("highlighting");
    c.classList.add("found");
  });

  const listItems = document.querySelectorAll(".word-to-find");
  listItems.forEach(item => {
    if (item.textContent === word) {
      item.classList.add("crossed");
    }
  });
}

function checkWin() {
  const allCrossed = [...document.querySelectorAll(".word-to-find")].every(w =>
    w.classList.contains("crossed")
  );

  if (allCrossed) {
    launchConfetti();
    showCongratsBanner();
  }
}

function getCellFromEvent(e) {
  const touch = e.touches?.[0];
  const target = touch ? document.elementFromPoint(touch.clientX, touch.clientY) : e.target;
  return target.closest(".cell");
}

function getDirection(a, b) {
  const r1 = +a.dataset.row;
  const c1 = +a.dataset.col;
  const r2 = +b.dataset.row;
  const c2 = +b.dataset.col;

  const dr = r2 - r1;
  const dc = c2 - c1;

  if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return null;
  if (dr === 0 && dc === 0) return null;

  return { r: Math.sign(dr), c: Math.sign(dc) };
}

/* --------------------------------------------------
   Instructions Toggle
-------------------------------------------------- */
function initInstructionsToggle() {
  const btn = document.getElementById("instrToggle");
  const panel = document.getElementById("instructionsPanel");

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!isOpen));

    if (isOpen) {
      panel.classList.add("hidden");
      panel.setAttribute("aria-hidden", "true");
    } else {
      panel.classList.remove("hidden");
      panel.setAttribute("aria-hidden", "false");
    }
  });
}

/* --------------------------------------------------
   Confetti + Congrats Banner
-------------------------------------------------- */
function launchConfetti() {
  confetti({
    spread: 70,
    origin: { y: 0.6 }
  });
}

function showCongratsBanner() {
  if (document.getElementById("congratsBanner")) return;

  const banner = document.createElement("div");
  banner.id = "congratsBanner";
  banner.textContent = "Great job! You found all the words!";
  document.getElementById("boardWrap").before(banner);

  setTimeout(() => banner.remove(), 3000);
}

/* --------------------------------------------------
   Init — REQUIRED
-------------------------------------------------- */
window.addEventListener("load", () => {
  initInteractionHandlers();
  initInstructionsToggle();
  document.getElementById("generateButton").addEventListener("click", generateWordSearch);

  generateWordSearch();
});

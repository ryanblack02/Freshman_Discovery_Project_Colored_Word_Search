/* ============================================
   Animal Word Search - Fully Revised Script
   (Your full words object inserted correctly)
   ============================================ */

/* --- WORD LIST DATA --- */
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

/* ======================================================
   Generator Settings
====================================================== */
const GRID_SIZE = 14;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ======================================================
   Utility Functions
====================================================== */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ======================================================
   Pick Words
====================================================== */
function pickWords(category, difficulty) {
  const list = words[category][difficulty];
  return difficulty === "kid" ? list.slice(0, 12) : list.slice(0, 18);
}

/* ======================================================
   Build Empty Grid
====================================================== */
function makeGrid() {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "")
  );
}

/* ======================================================
   Attempt Word Placement
====================================================== */
function attemptPlace(grid, word) {
  const directions = [
    [1, 0],  [-1, 0],  [0, 1],  [0, -1],
    [1, 1],  [-1, -1], [1, -1], [-1, 1]
  ];

  word = word.toUpperCase();
  for (let tries = 0; tries < 100; tries++) {
    const dir = directions[rand(0, directions.length - 1)];
    let r = rand(0, GRID_SIZE - 1);
    let c = rand(0, GRID_SIZE - 1);

    let ok = true;
    for (let i = 0; i < word.length; i++) {
      const rr = r + dir[0] * i;
      const cc = c + dir[1] * i;
      if (rr < 0 || rr >= GRID_SIZE || cc < 0 || cc >= GRID_SIZE) {
        ok = false;
        break;
      }
      if (grid[rr][cc] && grid[rr][cc] !== word[i]) {
        ok = false;
        break;
      }
    }

    if (!ok) continue;

    for (let i = 0; i < word.length; i++) {
      const rr = r + dir[0] * i;
      const cc = c + dir[1] * i;
      grid[rr][cc] = word[i];
    }
    return true;
  }
  return false;
}

/* ======================================================
   Fill Remaining Letters
====================================================== */
function fillGridRandom(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) {
        grid[r][c] = ALPHABET[rand(0, ALPHABET.length - 1)];
      }
    }
  }
}

/* ======================================================
   Render Grid
====================================================== */
function renderGrid(grid) {
  const gridDiv = document.getElementById("grid");
  gridDiv.innerHTML = "";

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = grid[r][c];
      gridDiv.appendChild(cell);
    }
  }
}

/* ======================================================
   Render Word List
====================================================== */
function renderWordList(wordsArr) {
  const listDiv = document.getElementById("wordListContainer");
  listDiv.innerHTML =
    "<strong>Words to Find:</strong><br>" +
    wordsArr.map(w => `<span class="word">${w}</span>`).join("<br>");
}

/* ======================================================
   Main Generate Function
====================================================== */
function generateWordSearch() {
  const category = document.getElementById("categoryDropdown").value;
  const difficulty = document.getElementById("difficultyDropdown").value;

  const chosen = pickWords(category, difficulty);
  const grid = makeGrid();

  for (const w of chosen) {
    attemptPlace(grid, w);
  }

  fillGridRandom(grid);
  renderGrid(grid);
  renderWordList(chosen);
  updateCategoryLabel(category, difficulty);
}

/* ======================================================
   Category Label Update
====================================================== */
function updateCategoryLabel(cat, diff) {
  document.getElementById("categoryLabel").textContent =
    `Category: ${cat} | Difficulty: ${diff}`;
}

/* ======================================================
   Instructions Toggle
====================================================== */
function initInstructionsToggle() {
  const panel = document.getElementById("instructionsPanel");
  const btn = document.getElementById("instrToggle");

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));

    panel.classList.toggle("hidden");
    panel.setAttribute("aria-hidden", expanded ? "true" : "false");
  });
}

/* ======================================================
   Initialize on Load
====================================================== */
window.addEventListener("load", () => {
  initInstructionsToggle();
  document.getElementById("generateButton").addEventListener("click", generateWordSearch);
  generateWordSearch();
});

/* Animal Word Search — script.js
   - Confetti (canvas-confetti) triggers on completion
   - Congrats banner stays until the user generates a new grid
   - Works for initial auto-grid and any user-generated grid
*/

let currentGrid = null;
let cellElements = [];               // 2D array of DOM nodes [r][c]
let chosenWords = [];                // UPPERCASE words
let chosenWordColors = {};           // word -> { highlightClass }
let foundSet = new Set();

let isPointerDown = false;
let pointerStart = null; // [r,c]
let pointerLast = null;

const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = max => Math.floor(Math.random() * max);

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

/* --- Grid helpers --- */
function getGridSizeByWords(ws){
  const maxLen = Math.max(...ws.map(w=>w.length));
  return Math.max(12, maxLen + 3);
}
function createEmptyGrid(size){
  return Array.from({length:size},()=>Array(size).fill(""));
}
function fillEmptySpaces(grid){
  const alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<grid.length;r++){
    for(let c=0;c<grid.length;c++){
      if(!grid[r][c]) grid[r][c]=randomChoice(alpha);
    }
  }
}

/* --- Place words into grid --- */
function placeWord(grid,word){
  const dirs=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  const size = grid.length;
  for(let attempt=0; attempt<400; attempt++){
    const [dr,dc] = randomChoice(dirs);
    const row = randInt(size), col = randInt(size);
    const coords = [];
    let fits = true;
    for(let i=0;i<word.length;i++){
      const r = row + dr*i, c = col + dc*i;
      if(r<0||r>=size||c<0||c>=size){ fits=false; break; }
      const cell = grid[r][c];
      if(cell && cell !== word[i]) { fits=false; break; }
      coords.push([r,c]);
    }
    if(!fits) continue;
    coords.forEach(([r,c],i)=> grid[r][c] = word[i]);
    return true;
  }
  console.warn("Couldn't place:", word);
  return false;
}

/* --- Rendering --- */
function renderGridToDOM(grid){
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${grid.length}, 40px)`;
  cellElements = [];
  for(let r=0;r<grid.length;r++){
    const rowEls = [];
    for(let c=0;c<grid.length;c++){
      const el = document.createElement("div");
      el.className = `cell ${randomChoice(kidColors)}`;
      el.dataset.row = r;
      el.dataset.col = c;
      el.textContent = grid[r][c];
      gridEl.appendChild(el);
      rowEls.push(el);
    }
    cellElements.push(rowEls);
  }
}

function renderWordList(ws){
  const cont = document.getElementById("wordListContainer");
  cont.innerHTML = "<strong>Words to Find:</strong><br>";
  ws.forEach((w,i)=>{
    const chip = document.createElement("span");
    chip.className = `word-chip ${kidColors[i % kidColors.length]}`;
    chip.textContent = w;
    chip.dataset.word = w;
    cont.appendChild(chip);
  });
}

/* --- Path helpers --- */
function getPath(r1,c1,r2,c2){
  const path = [];
  const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
  let r = r1, c = c1;
  while(true){
    path.push([r,c]);
    if(r === r2 && c === c2) break;
    r += dr; c += dc;
    if(r<0 || c<0 || r>=currentGrid.length || c>=currentGrid.length) break;
  }
  return path;
}

function getPathWord(r1,c1,r2,c2,grid){
  const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
  if(dr === 0 && dc === 0) return grid[r1][c1];
  let r = r1, c = c1, str = "";
  while(true){
    str += grid[r][c];
    if(r === r2 && c === c2) break;
    r += dr; c += dc;
  }
  return str;
}

/* --- Temporary highlight and clearing --- */
function clearTemp(){
  document.querySelectorAll(".cell").forEach(cell=>{
    cell.classList.remove("temp");
    // remove highlight-* classes if not permanent (no glow)
    Array.from(cell.classList).forEach(c=>{
      if(c.startsWith("highlight-") && !cell.classList.contains("glow")){
        cell.classList.remove(c);
      }
    });
  });
}

function showTemp(r1,c1,r2,c2){
  clearTemp();
  if(!currentGrid) return;
  const path = getPath(r1,c1,r2,c2);
  if(path.length === 0) return;
  let str = "";
  for(const [r,c] of path) str += currentGrid[r][c];

  // find matching word (forward or reversed)
  let matchWord = null;
  for(const w of chosenWords){
    const rev = w.split("").reverse().join("");
    if(w === str || rev === str){ matchWord = w; break; }
  }
  const tempCls = matchWord ? chosenWordColors[matchWord].highlightClass : null;

  for(const [r,c] of path){
    const el = cellElements[r][c];
    if(!el) continue;
    el.classList.add("temp");
    if(tempCls && !el.classList.contains("glow")) el.classList.add(tempCls);
  }
}

/* --- Mark found word --- */
function markWordFound(word,r1,c1,r2,c2){
  if(foundSet.has(word)) return; // already marked
  const info = chosenWordColors[word];
  const cls = info ? info.highlightClass : null;
  const path = getPath(r1,c1,r2,c2);
  for(const [r,c] of path){
    const el = cellElements[r][c];
    if(!el) continue;
    if(cls) el.classList.add(cls);
    // preserve original color class
    const colorClass = Array.from(el.classList).find(cl=>cl.startsWith("color-"));
    if(colorClass){
      // add corresponding highlight class based on color
      const neonName = colorClass.replace("color-","");
      el.classList.add(`highlight-${neonName}`);
    }
    el.classList.add("glow");
    el.classList.remove("temp");
  }
@@ -211,6 +214,8 @@ function markWordFound(word,r1,c1,r2,c2){
  }
}

}

/* --- Congratulations + confetti --- */
function showCongratulations(){
  // avoid multiple calls
}

}

/* --- Congratulations + confetti --- */
function showCongratulations(){
  // avoid multiple calls
  const existing = document.getElementById("congratsBanner");
  if(existing) return;

  const banner = document.createElement("div");
  banner.id = "congratsBanner";
  banner.className = "show";
  banner.textContent = "🎉 Congratulations! You found all the words!";
  // Insert banner above boardWrap
  const boardWrap = document.getElementById("boardWrap");
  boardWrap.parentNode.insertBefore(banner, boardWrap);

  // Confetti burst (big initial burst + a lightweight stream)
  try {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.35 }
    });
    // small continuing stream for 800ms
    const end = Date.now() + 800;
    (function frame() {
      confetti({
        particleCount: 6,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.6 + 0.2 }
      });
      if(Date.now() < end) requestAnimationFrame(frame);
    })();
  } catch (err) {
    // confetti lib not available — silently ignore
    console.warn("confetti failed:", err);
  }
}

/* remove any existing congrats banner (used when generating new grid) */
function removeCongratsBanner(){
  const b = document.getElementById("congratsBanner");
  if(b) b.remove();
}

/* --- DOM hit detection helper --- */
function getCellFromPoint(x, y){
  const el = document.elementFromPoint(x, y);
  if(!el) return null;
  let node = el;
  while(node && node !== document.body){
    if(node.classList && node.classList.contains("cell")){
      const r = parseInt(node.dataset.row, 10);
      const c = parseInt(node.dataset.col, 10);
      if(Number.isFinite(r) && Number.isFinite(c)) return [r, c];
      return null;
    }
    node = node.parentElement;
  }
  return null;
}

/* --- Interaction handlers --- */
function initInteractionHandlers(){
  const gridEl = document.getElementById("grid");

  function getPointer(e){ return e.touches ? e.touches[0] : e; }

  function down(e){
    if(!currentGrid) return;
    if(e.touches) e.preventDefault?.();
    isPointerDown = true;
    const p = getPointer(e);
    pointerStart = getCellFromPoint(p.clientX, p.clientY);
    pointerLast = pointerStart;
    if(pointerStart) showTemp(pointerStart[0], pointerStart[1], pointerStart[0], pointerStart[1]);
  }

  function move(e){
    if(!isPointerDown || !currentGrid) return;
    const p = getPointer(e);
    const c = getCellFromPoint(p.clientX, p.clientY);
    if(!c || !pointerStart) return;
    if(pointerLast && pointerLast[0] === c[0] && pointerLast[1] === c[1]) return;
    pointerLast = c;
    showTemp(pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1]);
  }

  function up(){
    if(!isPointerDown || !currentGrid) return;
    isPointerDown = false;
    if(pointerStart && pointerLast){
      const w = getPathWord(pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1], currentGrid);
      const rev = w.split("").reverse().join("");
      if(chosenWords.includes(w)) markWordFound(w, pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1]);
      else if(chosenWords.includes(rev)) markWordFound(rev, pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1]);
    }
    clearTemp();
    pointerStart = null;
    pointerLast = null;
  }

  gridEl.addEventListener("mousedown", down);
  gridEl.addEventListener("touchstart", down, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
}

/* --- Generate puzzle --- */
function generateWordSearch(){
  // remove any existing congrats banner when starting a new puzzle
  removeCongratsBanner();

  foundSet = new Set(); chosenWords = []; chosenWordColors = {};
  clearTemp();

  const cat = document.getElementById("categoryDropdown").value || "mammals";
  const diff = document.getElementById("difficultyDropdown").value || "kid";
  let pool = (words[cat] && words[cat][diff]) ? words[cat][diff].slice() : [];
  pool = pool.map(w => w.toUpperCase());

  // choose 6 words (keeps original behavior)
  chosenWords = pool.sort(()=>0.5 - Math.random()).slice(0, 6);
  chosenWords.forEach((w, i) => chosenWordColors[w] = { highlightClass: neonClassForIndex(i) });

  const size = getGridSizeByWords(chosenWords);
  const grid = createEmptyGrid(size);

  // try placing all chosen words (if any fail it's ok — they were warned in console)
  chosenWords.forEach(w => placeWord(grid, w));
  fillEmptySpaces(grid);

  currentGrid = grid;
  renderGridToDOM(grid);
  renderWordList(chosenWords);

  document.getElementById("categoryLabel").textContent = `Category: ${cat} | Difficulty: ${diff}`;
}

/* --- Instructions toggle --- */
function initInstructionsToggle(){
  const btn = document.getElementById("instrToggle");
  const panel = document.getElementById("instructionsPanel");
  btn.addEventListener("click", ()=>{
    const isHidden = panel.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", (!isHidden).toString());
    panel.setAttribute("aria-hidden", isHidden.toString());
    if(!isHidden) panel.scrollIntoView({behavior:"smooth", block:"center"});
  });
}

/* --- Init --- */
window.addEventListener("load", ()=>{
  initInteractionHandlers();
  initInstructionsToggle();

  const genBtn = document.getElementById("generateButton");
  genBtn.addEventListener("click", generateWordSearch);

  // initial puzzle
  generateWordSearch();
});

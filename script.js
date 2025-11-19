/* ===========================
   Animal Word Search — script.js
   Fully integrated (DOM-based hit detection + instructions)
   =========================== */

let currentGrid = null;
let cellElements = [];               // 2D array of DOM nodes [row][col]
let chosenWords = [];                // UPPERCASE
let chosenWordColors = {};           // word -> { highlightClass }
let foundSet = new Set();
let gridContainer = null;

let isPointerDown = false;
let pointerStart = null;             // [r,c]
let pointerLast = null;

const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = max => Math.floor(Math.random() * max);

const words = {
  mammals: {
    kid: [
      "Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
      "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
      "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel"
    ],
    adult: [
      "Aardvark","Aardwolf","Alpaca","Antelope","Baboon","Badger","Bison","Bobcat",
      "Capybara","Caribou","Civet","Coyote","Dugong","Eland","Echidna","Ermine",
      "FennecFox","Ferret","Gazelle","Gerenuk","Gibbon","Goral","Groundhog","Hedgehog",
      "Hippopotamus","Hyaena","Ibex","Impala","Jackal","Jaguar","Kakapo","KangarooRat",
      "Kinkajou","Koala","Kudu","Lemur","Lynx","Manatee","Marten","Meerkat",
      "Mongoose","Moose","Muskox","Narwhal","Numbat","Ocelot","Okapi","Orangutan",
      "OtterSea","Pangolin","Peccary","Pika","Platypus","Porcupine","PrairieDog",
      "ProboscisMonkey","Pronghorn","Puma","Quokka","Quoll","Raccoon","Reindeer",
      "RedPanda","RestlessOne","Ringtail","SeaLion","Serval","Shearwater","Shrew",
      "SlowLoris","SpermWhale","SableAntelope","Sifaka","Skunk","Sloth","Stoat",
      "Tapir","TasmanianDevil","Tamarin","TigerShark","Vervet","Vicuna","Warthog",
      "WaterBuffalo","Weasel","Wolverine","Yak","Zorilla"
    ]
  },

  birds: {
    kid: [
      "Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin","Flamingo",
      "Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan","Woodpecker","Seagull",
      "Pelican","Ostrich","Dove","Pigeon","Turkey","Condor","Stork"
    ],
    adult: [
      "Albatross","Anhinga","Avocet","BaldEagle","BarnOwl","BarnSwallow","Bittern",
      "Bowerbird","Budgerigar","Buzzard","Cacique","Canary","Cassowary","Cockatoo",
      "Cormorant","Crane","Cuckoo","Curlew","DoveTanager","Dovekie","Drongo",
      "Dunlin","Eider","Egret","Emu","Falcon","Firefinch","Flycatcher","Gannet",
      "Goldfinch","Goshawk","Grebe","Grossbeak","Grouse","Guineafowl","Gull",
      "Harrier","Heron","Honeycreeper","Hoopoe","Hornbill","Ibis","Jacana","Junco",
      "Kestrel","Ketupa","Kingfisher","Kite","Kookaburra","Lapwing","Lark",
      "Lyrebird","Magpie","Marabou","Myna","Nightingale","Nuthatch","Osprey",
      "Oystercatcher","Parakeet","Parrotlet","Petrel","Plover","Ptarmigan",
      "Quail","Rail","Raven","Roadrunner","RosyFinch","Rook","Sandpiper","Spoonbill",
      "Stilt","Sunbird","SwanGoose","Tern","Turnstone","Vireo","Vulture","Warbler",
      "Waxwing","Wryneck"
    ]
  },

  reptiles: {
    kid: [
      "Snake","Lizard","Turtle","Crocodile","Alligator","Chameleon","Gecko","Iguana",
      "Tortoise","Skink","Anole","GarterSnake","Copperhead"
    ],
    adult: [
      "KomodoDragon","Boa","Python","Monitor","Basilisk","Viper","Mamba","Taipan",
      "GilaMonster","Rattlesnake","Copperhead","CoralSnake","KingCobra","WaterPython",
      "GreenAnaconda","GlassLizard","HornedLizard","BeardedDragon","Adder","LeopardTortoise",
      "GalapagosTortoise","DesertTortoise","AmericanAlligator","SaltwaterCrocodile",
      "SpectacledCaiman","CrocodileMonitor","FlyingDragon","SeaSnake","BandedKrait",
      "BlackMamba","BushSnake","Coachwhip","CopperbellySalamander","Diamondback",
      "EasternTigerSnake","FenceLizard","GarterSnake","HornedViper","IndianPython",
      "JavelinLizard","KingRatSnake","LeafNosedGecko","MexicanBeadedLizard",
      "NightLizard","OliveRidley","PlainsGarter","QuinceMonitor","RedTailedBoa",
      "Scheltopusik","TreeBoa","Uromastyx","ViperBoa","WaterMonitor","YellowAnaconda",
      "Zebra-tailedLizard"
    ]
  },

  amphibians: {
    kid: [
      "Frog","Toad","Salamander","Newt","TreeFrog","Bullfrog","Mudpuppy","Tadpole",
      "Axolotl","GlassFrog"
    ],
    adult: [
      "Caecilian","Hellbender","Sirens","Olm","TigerSalamander","FireSalamander",
      "GiantSalamander","PoisonDartFrog","GlassFrogSpecies","MarshFrog","PickerelFrog",
      "RedEft","SpadefootToad","WoodFrog","DarwinFrog","CommonToad","EuropeanNewt",
      "OliveToad","CaneToad","Salamandra","GiantClawedFrog","SurinamToad","HoodedFrog",
      "AfricanClawedFrog","BorealToad","NatterjackToad","MoorFrog","TomatoFrog",
      "FireBelliedToad","MidwifeToad","SmoothNewt","YellowBelliedToad","EasternNewt",
      "Ambystoma","TigerSalamanderSp"
    ]
  },

  fish: {
    kid: [
      "Goldfish","Shark","Tuna","Trout","Salmon","Clownfish","Catfish","MantaRay",
      "Angelfish","Guppy","Seahorse","Stingray","Carp","Pufferfish","Perch"
    ],
    adult: [
      "Barracuda","Grouper","Swordfish","Anglerfish","Lionfish","Betta","Piranha",
      "Marlin","Sturgeon","Snapper","Halibut","Mackerel","Wahoo","Tarpon","Coelacanth",
      "ElectricEel","BluefinTuna","AtlanticCod","PacificHerring","Yellowtail",
      "Kingfish","Bonefish","Archerfish","Bichir","Blowfish","BroadaxeGurnard",
      "Butterfish","Carp","ChannelCatfish","Cusk","Dogfish","Dorado","Dory",
      "Eelpout","Flounder","Garfish","Goby","Hake","Herring","JackCrevalle","JohnDory",
      "Lamprey","Lizardfish","MahiMahi","Monkfish","MorayEel","Needlefish",
      "NorthernPike","OrangeRoughy","Parrotfish","Pilotfish","Pollock","Pomfret",
      "Pompano","Puffer","RibbonFish","Sailfish","Sculpin","Shad","Skate","Smelt",
      "Sole","Sunfish","Tilapia","Toadfish","Triggerfish","Weakfish","Whitefish",
      "Wrasse","YellowfinTuna"
    ]
  },

  insects: {
    kid: [
      "Ant","Bee","Butterfly","Beetle","Fly","Wasp","Grasshopper","Ladybug","Firefly",
      "Caterpillar","Dragonfly","Moth","Cricket","Honeybee","Bumblebee"
    ],
    adult: [
      "Aphid","AssassinBug","AtlasMoth","BarkBeetle","BeeEater","BombardierBeetle",
      "BoxElderBug","CarpenterAnt","Cicada","ClickBeetle","Cockroach","Cranefly",
      "DamselFly","Dobsonfly","Earwig","Flea","FruitFly","GiantWaterBug","Gnat",
      "GrasshopperSp","GreenJuneBeetle","GroundBeetle","Hopper","Ichneumon",
      "JuneBug","Katydid","LeafInsect","LeafcutterAnt","Locust","Louse","Mantid",
      "Mayfly","MoleCricket","NetWing","QueenBee","RoveBeetle","Sawfly","ScorpionFly",
      "Silkworm","SoldierBeetle","StinkBug","Stonefly","Termite","Thrips","TigerBeetle",
      "Treehopper","Vespid","Weevil","Whirligig","Yellowjacket","Zoraptera"
    ]
  },

  invertebrates: {
    kid: [
      "Snail","Worm","Jellyfish","Crab","Octopus","Starfish","Clam","Shrimp","SeaUrchin",
      "Sponge","Lobster","Slug","Scallop"
    ],
    adult: [
      "Abalone","Anemone","Barnacle","BrittleStar","Buccinoid",
      "Cuttlefish","Cymothoid","Cymothoa","CrownOfThorns","Ctenophore","DungenessCrab",
      "FeatherDusterWorm","Flatworm","GiantClam","GhostCrab","Gorgonian","HermitCrab",
      "HorseshoeCrab","Isopod","Krill","Leech","LionManeJellyfish","Limpet","LobsterSp",
      "MantisShrimp","MoonJelly","Nautilus","Octocoral","PenaeidPrawn","PearlOyster",
      "PortugueseManOWar","SeaAnemone","SeaCucumber","SeaFan","SeaSlater","SeaSquirt",
      "SeaWasp","ShrimpCleaner","Siphonophore","SpinyLobster","SquatLobster","Squid",
      "TarantulaSeaAnemone","TubeWorm","VampireSquid","VelvetWorm","VenusComb",
      "Whelk","Woodlouse","Zooplankton"
    ]
  }
};

/* --- Grid helpers --- */
function getGridSizeByWords(ws){
  const maxLen = Math.max(...ws.map(w=>w.length));
  return Math.max(12, maxLen + 3);
}
function createEmptyGrid(size){ return Array.from({length:size},()=>Array(size).fill("")); }
function fillEmptySpaces(grid){
  const alpha="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<grid.length;r++)
    for(let c=0;c<grid.length;c++)
      if(!grid[r][c]) grid[r][c]=randomChoice(alpha);
}

/* --- Place words --- */
function placeWord(grid,word){
  const dirs=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  const size=grid.length;
  for(let attempt=0;attempt<400;attempt++){
    const [dr,dc]=randomChoice(dirs);
    const row=randInt(size), col=randInt(size);
    const coords=[];
    let fits=true;
    for(let i=0;i<word.length;i++){
      const r=row+dr*i,c=col+dc*i;
      if(r<0||r>=size||c<0||c>=size){ fits=false; break; }
      const cell=grid[r][c];
      if(cell && cell!==word[i]){ fits=false; break; }
      coords.push([r,c]);
    }
    if(!fits) continue;
    coords.forEach(([r,c],i)=>grid[r][c]=word[i]);
    return true;
  }
  console.warn("Couldn't place:", word);
  return false;
}

/* --- Rendering --- */
function renderGridToDOM(grid){
  const gridEl=document.getElementById("grid");
  gridEl.innerHTML="";
  gridEl.style.gridTemplateColumns=`repeat(${grid.length}, 40px)`;
  cellElements=[];
  for(let r=0;r<grid.length;r++){
    const rowEls=[];
    for(let c=0;c<grid.length;c++){
      const el=document.createElement("div");
      el.className=`cell ${randomChoice(kidColors)}`;
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
  const cont=document.getElementById("wordListContainer");
  cont.innerHTML="<strong>Words to Find:</strong><br>";
  ws.forEach((w,i)=>{
    const chip=document.createElement("span");
    chip.className=`word-chip ${kidColors[i%kidColors.length]}`;
    chip.textContent=w;
    chip.dataset.word=w;
    cont.appendChild(chip);
  });
}

/* --- Path helpers --- */
function getPath(r1,c1,r2,c2){
  const path=[];
  const dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  let r=r1,c=c1;
  while(true){
    path.push([r,c]);
    if(r===r2 && c===c2) break;
    r+=dr; c+=dc;
    if(r<0||c<0||r>=currentGrid.length||c>=currentGrid.length) break;
  }
  return path;
}
function getPathWord(r1,c1,r2,c2,grid){
  const dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  if(dr===0 && dc===0) return grid[r1][c1];
  let r=r1,c=c1,str="";
  while(true){
    str+=grid[r][c];
    if(r===r2 && c===c2) break;
    r+=dr; c+=dc;
  }
  return str;
}

/* --- Temporary highlight and matching color --- */
function clearTemp(){
  document.querySelectorAll(".cell").forEach(cell=>{
    cell.classList.remove("temp");
    const toRemove = Array.from(cell.classList).filter(c => c.startsWith("highlight-"));
    toRemove.forEach(c => {
      if(!cell.classList.contains("glow")) cell.classList.remove(c);
    });
  });
}

function showTemp(r1,c1,r2,c2){
  clearTemp();
  if(!currentGrid) return;
  const path = getPath(r1,c1,r2,c2);
  if(path.length === 0) return;

  // Build string for path
  let str = "";
  for(const [r,c] of path) str += currentGrid[r][c];

  // Check if this path matches any chosen word (direct or reversed)
  let matchWord = null;
  for(const w of chosenWords){
    if(w === str || w === str.split("").reverse().join("")) { matchWord = w; break; }
  }

  // If match found, get that word's highlight class
  const tempHighlightClass = matchWord ? chosenWordColors[matchWord].highlightClass : null;

  // Apply classes
  for(const [r,c] of path){
    const el = cellElements[r][c];
    if(!el) continue;
    el.classList.add("temp");
    if(tempHighlightClass && !el.classList.contains("glow")) el.classList.add(tempHighlightClass);
  }
}

/* --- Mark found word --- */
function markWordFound(word,r1,c1,r2,c2){
  const info = chosenWordColors[word];
  const cls = info.highlightClass;
  const path = getPath(r1,c1,r2,c2);
  for(const [r,c] of path){
    const el = cellElements[r][c];
    if(!el) continue;
    el.classList.add(cls, "glow");
    el.classList.remove("temp");
  }
  document.querySelectorAll(".word-chip").forEach(ch=>{
    if(ch.dataset.word === word) ch.classList.add("marked");
  });
  foundSet.add(word);
  if(foundSet.size === chosenWords.length) showCongratulations();
}

/* --- Congrats --- */
function showCongratulations(){
  const old = document.getElementById("congratsMessage");
  if(old) old.remove();
  const msg = document.createElement("div");
  msg.id = "congratsMessage";
  msg.style = "font-size:24px;color:#fff;text-align:center;margin:12px;";
  msg.textContent = "🎉 Congratulations! You found all words!";
  document.body.insertBefore(msg, document.getElementById("boardWrap"));
}

/* --- DOM-based hit detection --- */
function getCellFromPoint(x, y){
  // Use elementFromPoint so we hit the real cell under the pointer; this avoids all scaling/zoom/padding offsets.
  const el = document.elementFromPoint(x, y);
  if(!el) return null;
  // walk up until .cell found (in case sub-element)
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

/* --- Interaction handlers (uses DOM hit detection) --- */
function initInteractionHandlers(){
  gridContainer = document.getElementById("grid");

  function getPointer(e){ return e.touches ? e.touches[0] : e; }

  function down(e){
    if(!currentGrid) return;
    if(e.targetTouches) e.preventDefault?.();
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

  function up(e){
    if(!isPointerDown || !currentGrid) return;
    isPointerDown = false;
    if(pointerStart && pointerLast){
      const w = getPathWord(pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1], currentGrid);
      const rev = w.split("").reverse().join("");
      if(chosenWords.includes(w)) markWordFound(w, pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1]);
      else if(chosenWords.includes(rev)) markWordFound(rev, pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1]);
    }
    clearTemp();
    pointerStart = null; pointerLast = null;
  }

  gridContainer.addEventListener("mousedown", down);
  gridContainer.addEventListener("touchstart", down, { passive: false });

  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, { passive: false });

  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
}

/* --- Generate puzzle --- */
function generateWordSearch(){
  const oldMsg = document.getElementById("congratsMessage");
  if(oldMsg) oldMsg.remove();
  foundSet = new Set(); chosenWords = []; chosenWordColors = {}; clearTemp();

  const cat = document.getElementById("categoryDropdown").value || "mammals";
  const diff = document.getElementById("difficultyDropdown").value || "kid";
  let pool = (words[cat] && words[cat][diff]) ? words[cat][diff].slice() : [];
  pool = pool.map(w => w.toUpperCase());

  // choose 6 words
  chosenWords = pool.sort(()=>0.5 - Math.random()).slice(0, 6);
  chosenWords.forEach((w, i) => chosenWordColors[w] = { highlightClass: neonClassForIndex(i) });

  const size = getGridSizeByWords(chosenWords);
  const grid = createEmptyGrid(size);
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
    const isOpen = !panel.classList.contains("hidden");
    if(isOpen){
      panel.classList.add("hidden");
      btn.setAttribute("aria-expanded","false");
      panel.setAttribute("aria-hidden","true");
    } else {
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded","true");
      panel.setAttribute("aria-hidden","false");
      panel.scrollIntoView({behavior:"smooth", block:"center"});
    }
  });
}

/* --- Init --- */
window.addEventListener("load", ()=>{
  initInteractionHandlers();
  initInstructionsToggle();
  const genBtn = document.getElementById("generateButton");
  if(genBtn) genBtn.onclick = generateWordSearch;
  generateWordSearch(); // starter grid
});

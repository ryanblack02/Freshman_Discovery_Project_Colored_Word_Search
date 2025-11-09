/* ===========================
   Animal Word Search — script.js
   Complete revised version
   =========================== */

/* --- Globals --- */
let currentGrid = null;             // 2D array of letters
let cellElements = [];              // 2D array [row][col] DOM nodes
let chosenWords = [];               // array of UPPERCASE words currently to find
let chosenWordColors = {};          // map word -> { highlightClass }
let foundSet = new Set();           // set of found words
let gridContainer = null;           // DOM element for #grid
let isPointerDown = false;
let pointerStart = null;            // [r,c]
let pointerLast = null;

/* --- Color / neon helpers (matches your CSS) --- */
const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = max => Math.floor(Math.random() * max);

/* --- Word database (expanded where needed) --- */
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
    adult: ["Komododragon","GarterSnake","Boa","Python","Anole","Tortoise","Monitor","Basilisk","Skink","Viper"]
  },
  amphibians: {
    kid: ["Frog","Toad","Salamander","Newt","TreeFrog","Bullfrog","Mudpuppy","Tadpole"],
    adult: ["Axolotl","Caecilian","Hellbender","Sirens","Olm","TigerSalamander","FireSalamander","GiantSalamander"]
  },
  fish: {
    kid: ["Goldfish","Shark","Tuna","Trout","Salmon","Clownfish","Catfish","MantaRay","Angelfish","Guppy"],
    adult: ["Barracuda","Grouper","Swordfish","Anglerfish","Lionfish","Betta","Piranha","Marlin","Sturgeon","Snapper"]
  },
  insects: {
    kid: ["Ant","Bee","Butterfly","Beetle","Fly","Wasp","Grasshopper","Ladybug","Firefly","Caterpillar"],
    adult: ["Dragonfly","Cricket","Termite","Moth","Mosquito","PrayingMantis","Cockroach","Hornet","Locust","Earwig"]
  },
  invertebrates: {
    kid: ["Snail","Worm","Jellyfish","Crab","Octopus","Starfish","Clam","Shrimp","SeaUrchin","Sponge"],
    adult: ["Lobster","Scorpion","Coral","Anemone","Cuttlefish","Nautilus","Squid","Barnacle","SeaCucumber","Krill"]
  }
};

/* --- Grid helpers --- */
function getGridSizeByWords(ws){
  const maxLen = Math.max(...ws.map(w => w.length));
  return Math.max(12, maxLen + 3);
}
function createEmptyGrid(size){
  return Array.from({length:size},()=>Array(size).fill(""));
}
function fillEmptySpaces(grid){
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<grid.length;r++)
    for(let c=0;c<grid.length;c++)
      if(!grid[r][c]) grid[r][c] = randomChoice(alpha);
}

/* --- Place words (8 directions, many attempts) --- */
function placeWord(grid, word){
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  const size = grid.length;
  for(let attempt=0;attempt<400;attempt++){
    const [dr,dc] = randomChoice(dirs);
    const row = randInt(size), col = randInt(size);
    const coords = [];
    let fits = true;
    for(let i=0;i<word.length;i++){
      const r=row+dr*i, c=col+dc*i;
      if(r<0||r>=size||c<0||c>=size){ fits=false; break; }
      const cell = grid[r][c];
      if(cell && cell !== word[i]){ fits=false; break; }
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
      el.dataset.row=r; el.dataset.col=c;
      el.textContent=grid[r][c];
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
    chip.textContent=w; chip.dataset.word=w;
    cont.appendChild(chip);
  });
}

/* --- Congrats (small) --- */
function showCongratulations(){
  const oldMsg=document.getElementById("congratsMessage");
  if(oldMsg) oldMsg.remove();

  const msg=document.createElement("div");
  msg.id="congratsMessage";
  msg.style="font-size:24px;color:#fff;text-align:center;margin:12px;";
  msg.textContent="🎉 Congratulations! You found all words!";
  document.body.insertBefore(msg, document.getElementById("boardWrap"));
}

/* --- Path helpers --- */
function getPathWord(r1,c1,r2,c2,grid){
  const dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  if(dr===0 && dc===0) return grid[r1][c1];
  let r=r1,c=c1,str="";
  while(true){
    if(r<0||c<0||r>=grid.length||c>=grid.length) return null;
    str+=grid[r][c];
    if(r===r2 && c===c2) break;
    r+=dr; c+=dc;
  }
  return str;
}

/* --- Interaction helpers (temp highlighting / marking) --- */
function clearTemp(){ document.querySelectorAll(".cell.temp").forEach(el=>el.classList.remove("temp")); }
function showTemp(r1,c1,r2,c2){
  clearTemp();
  const dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  let r=r1,c=c1;
  while(true){
    if(r<0||c<0||r>=currentGrid.length||c>=currentGrid.length) break;
    const el=cellElements[r][c];
    if(el) el.classList.add("temp");
    if(r===r2 && c===c2) break;
    r+=dr;c+=dc;
  }
}
function markWordFound(word,r1,c1,r2,c2){
  const info=chosenWordColors[word], cls=info.highlightClass;
  let r=r1,c=c1;
  while(true){
    cellElements[r][c].classList.add(cls,"glow");
    if(r===r2 && c===c2) break;
    r+=Math.sign(r2-r1); c+=Math.sign(c2-c1);
  }
  document.querySelectorAll(".word-chip").forEach(ch=>{
    if(ch.dataset.word===word) ch.classList.add("marked");
  });
  foundSet.add(word);

  if(foundSet.size===chosenWords.length){
    showCongratulations();
  }
}

/* --- Init interaction handlers (attach once) --- */
function initInteractionHandlers(){
  gridContainer = document.getElementById("grid");

  function getPointer(e){ return (e.touches?e.touches[0]:e); }

  function getCellFromPoint(x,y){
    const rect=gridContainer.getBoundingClientRect();
    if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom) return null;
    const cw=rect.width/currentGrid.length, ch=rect.height/currentGrid.length;
    return [Math.min(currentGrid.length-1, Math.floor((y-rect.top)/ch)), Math.min(currentGrid.length-1, Math.floor((x-rect.left)/cw))];
  }

  const down = e => {
    if(!currentGrid) return;
    isPointerDown=true;
    const p=getPointer(e);
    pointerStart=getCellFromPoint(p.clientX,p.clientY);
    pointerLast=pointerStart;
    if(pointerStart) showTemp(...pointerStart,...pointerStart);
  };
  const move = e => {
    if(!isPointerDown || !currentGrid) return;
    const p=getPointer(e);
    const c=getCellFromPoint(p.clientX,p.clientY);
    if(c) { pointerLast=c; showTemp(...pointerStart,...pointerLast); }
  };
  const up = e => {
    if(!isPointerDown || !currentGrid) return;
    isPointerDown=false;
    if(pointerStart && pointerLast){
      const w=getPathWord(...pointerStart,...pointerLast,currentGrid);
      if(w){
        const rev=w.split("").reverse().join("");
        if(chosenWords.includes(w)) markWordFound(w,...pointerStart,...pointerLast);
        else if(chosenWords.includes(rev)) markWordFound(rev,...pointerStart,...pointerLast);
      }
    }
    clearTemp();
    pointerStart=null; pointerLast=null;
  };

  window.addEventListener("mousedown", down);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  window.addEventListener("touchstart", down, {passive:false});
  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("touchend", up);
}

/* --- Generate puzzle (reads dropdowns) --- */
function generateWordSearch() {
  // 🧹 Remove old congratulations message if present
  const oldMsg = document.getElementById("congratsMessage");
  if (oldMsg) oldMsg.remove();

  // 🔄 Reset global trackers
  foundSet = new Set();
  chosenWords = [];
  chosenWordColors = {};
  clearTemp();

  // 🎯 Get selected category and difficulty
  const catEl = document.getElementById("categoryDropdown");
  const diffEl = document.getElementById("difficultyDropdown");
  const cat = catEl ? catEl.value : "mammals";
  const diff = diffEl ? diffEl.value : "kid";

  // 📚 Get a safe copy of the word pool
  let pool = (words[cat] && words[cat][diff]) ? words[cat][diff].slice() : [];
  pool = pool.map(w => w.toUpperCase());

  // 🎲 Randomly pick 6 words for this grid
  chosenWords = pool.sort(() => 0.5 - Math.random()).slice(0, 6);

  // 🌈 Assign highlight classes for each word
  chosenWords.forEach((w, i) => {
    chosenWordColors[w] = { highlightClass: neonClassForIndex(i) };
  });

  // 🔢 Create a grid and place words
  const size = getGridSizeByWords(chosenWords);
  const grid = createEmptyGrid(size);
  chosenWords.forEach(w => placeWord(grid, w));
  fillEmptySpaces(grid);

  // 🧱 Render everything to the page
  currentGrid = grid;
  renderGridToDOM(grid);
  renderWordList(chosenWords);

  // 🏷️ Update category/difficulty label
  const label = document.getElementById("categoryLabel");
  if (label) label.textContent = `Category: ${cat} | Difficulty: ${diff}`;
}

/* --- Init --- */
window.onload = ()=>{
  initInteractionHandlers();
  const genBtn = document.getElementById("generateButton");
  if(genBtn) genBtn.onclick = generateWordSearch;
  generateWordSearch();
};

/* ===========================
   Neon Word Search - script.js
   =========================== */

/* --- Full word lists (kept from your master list) --- */
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

/* --- palettes & helpers --- */
const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;

function getRandomInt(max){ return Math.floor(Math.random()*max); }
function randomChoice(arr){ return arr[getRandomInt(arr.length)]; }

/* --- grid helpers --- */
function getGridSizeByWords(ws){
  const maxLen = Math.max(...ws.map(w=>w.length));
  return Math.max(12, maxLen + 3);
}
function createEmptyGrid(size){
  return Array.from({length:size}, ()=>Array(size).fill(""));
}
function fillEmptySpaces(grid){
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<grid.length;r++){
    for(let c=0;c<grid.length;c++){
      if(!grid[r][c]) grid[r][c] = alpha[getRandomInt(alpha.length)];
    }
  }
}

/* place words (8 directions, allow matching overlaps) */
function placeWord(grid, word){
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  const size = grid.length;
  let attempts=0;
  while(attempts++ < 400){
    const [dr,dc] = dirs[getRandomInt(dirs.length)];
    const row = getRandomInt(size);
    const col = getRandomInt(size);
    let fits=true, positions=[];
    for(let i=0;i<word.length;i++){
      const r = row + dr*i, c = col + dc*i;
      if(r<0||r>=size||c<0||c>=size){ fits=false; break; }
      const cell = grid[r][c];
      if(cell && cell !== word[i]){ fits=false; break; }
      positions.push([r,c]);
    }
    if(!fits) continue;
    // place
    positions.forEach(([r,c],i)=>grid[r][c] = word[i]);
    return true;
  }
  console.warn("Failed to place", word);
  return false;
}

/* --- UI state --- */
let cellElements = []; // 2D array of DOM divs
let chosenWords = [];  // uppercase placed words
let chosenWordColors = {}; // word -> colorClass
let foundSet = new Set();

/* --- build & render --- */
function renderGridToDOM(grid){
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${grid.length}, 40px)`;
  cellElements = [];
  for(let r=0;r<grid.length;r++){
    const rowEls = [];
    for(let c=0;c<grid.length;c++){
      const d = document.createElement("div");
      d.className = "cell";
      d.dataset.row = r; d.dataset.col = c;
      d.textContent = grid[r][c];
      // assign kid color class randomly
      const colorClass = kidColors[getRandomInt(kidColors.length)];
      d.classList.add(colorClass);
      gridEl.appendChild(d);
      rowEls.push(d);
    }
    cellElements.push(rowEls);
  }
}

/* --- word list chips --- */
function renderWordList(words){
  const container = document.getElementById("wordListContainer");
  container.innerHTML = "";
  const title = document.createElement("div");
  title.innerHTML = "<strong>Words to Find:</strong>";
  container.appendChild(title);

  words.forEach((w,i)=>{
    const chip = document.createElement("span");
    chip.className = `word-chip ${kidColors[i % kidColors.length]}`;
    chip.textContent = w;
    chip.dataset.word = w;
    container.appendChild(chip);
    chosenWordColors[w] = kidColors[i % kidColors.length];
  });
}

/* --- audio (simple ding) --- */
let audioCtx;
function playDing(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(880, audioCtx.currentTime);
    g.gain.setValueAtTime(0, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.9);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + 0.9);
  }catch(e){ /* ignore */ }
}

/* --- sparkle trail --- */
const sparkleContainer = document.getElementById("sparkles");
function makeSparkle(x,y,color){
  const s = document.createElement("div");
  s.style.position="fixed";
  s.style.left = (x - 6) + "px";
  s.style.top = (y - 6) + "px";
  s.style.width = "8px"; s.style.height="8px";
  s.style.borderRadius="50%";
  s.style.pointerEvents="none";
  s.style.zIndex = 1200;
  s.style.background = color;
  s.style.opacity = "0.95";
  s.style.transform = `translateY(0px) scale(1)`;
  sparkleContainer.appendChild(s);
  // animate and remove
  const dx = (Math.random()-0.5)*40;
  const dy = -20 - Math.random()*40;
  s.animate([
    { transform: "translate(0,0) scale(1)", opacity:1 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.6)`, opacity:0 }
  ], { duration: 700 + Math.random()*400, easing: "cubic-bezier(.2,.7,.2,1)"});
  setTimeout(()=>s.remove(), 1100);
}

/* --- confetti --- */
function popConfetti(){
  const confettiRoot = document.getElementById("confetti");
  confettiRoot.innerHTML = "";
  const colors = ["#ff4c4c","#4c8cff","#4cff72","#ffa64c","#c04cff","#ff6fcf"];
  for(let i=0;i<70;i++){
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.background = colors[getRandomInt(colors.length)];
    piece.style.left = (20 + Math.random()*80) + "%";
    piece.style.top = "-10%";
    piece.style.opacity = 0.95;
    confettiRoot.appendChild(piece);
    // animate via JS
    const dx = (Math.random()-0.5)*600;
    const dy = 600 + Math.random()*400;
    const rot = Math.random()*720;
    piece.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity:1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity:0.9 }
    ], { duration: 2200 + Math.random()*1000, easing: "cubic-bezier(.2,.8,.2,1)"});
    setTimeout(()=> piece.remove(), 3200);
  }
}

/* --- find word from start->end coordinates inclusive/
       returns string of letters along straight path.
       If not straight (not a straight line in 8 directions) returns null.
*/
function getPathWord(r1,c1,r2,c2, grid){
  const dr = Math.sign(r2-r1);
  const dc = Math.sign(c2-c1);
  // if neither dx nor dy changes (same cell)
  if(dr===0 && dc===0){
    return grid[r1][c1];
  }
  // check if r1,c1 -> r2,c2 is aligned with dr/dc steps
  let r=r1, c=c1, letters="";
  while(true){
    if(r<0||c<0||r>=grid.length||c>=grid.length) return null;
    letters += grid[r][c];
    if(r===r2 && c===c2) break;
    r+=dr; c+=dc;
  }
  return letters;
}

/* --- main interactive drag logic --- */
let isPointerDown=false;
let pointerStart = null; // [r,c]
let pointerLast = null;
let currentGrid = null;

function clearTempSelection(){
  document.querySelectorAll(".cell").forEach(el=>{
    el.classList.remove("temp");
  });
}

function showTempSelection(r1,c1,r2,c2){
  clearTempSelection();
  const dr = Math.sign(r2-r1), dc = Math.sign(c2-c1);
  let r=r1, c=c1;
  while(true){
    if(r<0||c<0||r>=currentGrid.length||c>=currentGrid.length) break;
    const el = cellElements[r][c];
    if(el) el.classList.add("temp");
    if(r===r2 && c===c2) break;
    r+=dr; c+=dc;
  }
}

/* compute color for a word (assign neon class index) */
function assignColorsToChosenWords(ws){
  chosenWordColors = {};
  ws.forEach((w,i)=>{
    const colorIdx = i % neonNames.length;
    chosenWordColors[w] = {
      chipClass: kidColors[i % kidColors.length],
      highlightClass: neonClassForIndex(i),
      colorName: neonNames[colorIdx]
    };
  });
}

/* mark word as found (color cells and chip) */
function markWordFound(word, r1,c1,r2,c2){
  const info = chosenWordColors[word];
  const hclass = info.highlightClass;
  const colorName = info.colorName;
  // add highlight to cells along path
  const dr = Math.sign(r2-r1), dc = Math.sign(c2-c1);
  let r=r1, c=c1;
  while(true){
    const el = cellElements[r][c];
    el.classList.add(hclass, "glow");
    r+=dr; c+=dc;
    if(r<0||c<0||r>=currentGrid.length||c>=currentGrid.length) break;
    if(r===r2+dr && c===c2+dc) break;
    // stop after adding last by checking if previous loop reached end in next iteration
    if(r===r2 && c===c2){
      const el2 = cellElements[r][c];
      el2.classList.add(hclass, "glow");
      break;
    }
  }

  // cross out chip
  const chips = Array.from(document.querySelectorAll(".word-chip"));
  for(const ch of chips){
    if(ch.dataset.word === word){
      ch.classList.add("marked");
      break;
    }
  }
  foundSet.add(word);
  playDing();
  // confetti + win check
  if(foundSet.size === chosenWords.length){
    // show popup and confetti
    document.getElementById("winOverlay").classList.remove("hidden");
    document.getElementById("winMessage").textContent = "🎉 You found them all!";
    document.getElementById("playAgainButton").focus();
    popConfetti();
  }
}

/* --- pointer handlers (mouse & touch unified) --- */
function enableInteraction(grid){
  currentGrid = grid;
  const gridRect = document.getElementById("grid").getBoundingClientRect();

  const pointerDown = (evt) => {
    isPointerDown = true;
    const p = getPointerFromEvent(evt);
    const [r,c] = getCellFromPoint(p.x,p.y);
    if(r===null) return;
    pointerStart = [r,c];
    pointerLast = [r,c];
    clearTempSelection();
    // sparkle
    makeSparkle(p.x,p.y, "rgba(255,255,255,0.95)");
    evt.preventDefault();
  };

  const pointerMove = (evt) => {
    if(!isPointerDown) return;
    const p = getPointerFromEvent(evt);
    const found = getCellFromPoint(p.x,p.y);
    if(!found) return;
    const [r,c] = found;
    if(pointerLast && r===pointerLast[0] && c===pointerLast[1]) {
      // same cell
    } else {
      pointerLast = [r,c];
      // draw temp path from pointerStart to current
      if(pointerStart){
        showTempSelection(pointerStart[0], pointerStart[1], r, c);
      }
    }
    // sparkle
    makeSparkle(p.x,p.y, "rgba(255,255,255,0.85)");
  };

  const pointerUp = (evt) => {
    if(!isPointerDown) return;
    isPointerDown = false;
    const p = getPointerFromEvent(evt);
    const found = getCellFromPoint(p.x,p.y);
    if(!found){
      clearTempSelection();
      return;
    }
    const [r2,c2] = found;
    const [r1,c1] = pointerStart || [r2,c2];
    // get word along path
    const pathWord = getPathWord(r1,c1,r2,c2,currentGrid);
    if(!pathWord){
      clearTempSelection(); pointerStart = null; pointerLast = null; return;
    }
    const reversed = pathWord.split("").reverse().join("");
    // check match with chosenWords
    for(const w of chosenWords){
      if(w === pathWord || w === reversed){
        if(!foundSet.has(w)){
          markWordFound(w, r1,c1,r2,c2);
        }
        break;
      }
    }
    clearTempSelection();
    pointerStart = null;
    pointerLast = null;
  };

  // helpers: get pointer coords
  function getPointerFromEvent(e){
    const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    return {x,y};
  }

  // map page point to cell indexes
  function getCellFromPoint(x,y){
    const gridEl = document.getElementById("grid");
    const rect = gridEl.getBoundingClientRect();
    if(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
    const cellW = rect.width / grid.length;
    const cellH = rect.height / grid.length;
    // safer: compute col,row by iterating child positions
    const col = Math.min(grid.length-1, Math.floor((x - rect.left) / cellW));
    const row = Math.min(grid.length-1, Math.floor((y - rect.top) / cellH));
    return [row, col];
  }

  // attach events
  window.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);
  window.addEventListener("touchstart", pointerDown, {passive:false});
  window.addEventListener("touchmove", pointerMove, {passive:false});
  window.addEventListener("touchend", pointerUp);
}

/* --- Game generation entry point --- */
function generateWordSearch(){
  // reset state & UI
  document.getElementById("winOverlay").classList.add("hidden");
  document.getElementById("confetti").innerHTML="";
  foundSet.clear();
  chosenWords = [];

  const cat = document.getElementById("categoryDropdown").value;
  const diff = document.getElementById("difficultyDropdown").value;
  let pool = (words[cat] && words[cat][diff]) ? words[cat][diff].slice() : [];
  pool = pool.map(s => s.toUpperCase());
  pool.sort(()=>0.5 - Math.random());
  chosenWords = pool.slice(0, Math.min(6, pool.length)); // pick 6

  // assign colors map
  assignColorsToChosenWords(chosenWords);

  const gridSize = getGridSizeByWords(chosenWords);
  const grid = createEmptyGrid(gridSize);

  // place chosen words
  chosenWords.forEach(w => placeWord(grid, w));

  // fill and render
  fillEmptySpaces(grid);
  renderGridToDOM(grid);
  renderWordListToDOM(chosenWords);

  // store currentGrid for selection helpers
  currentGrid = grid;
  enableInteraction(grid);

  // update label
  document.getElementById("categoryLabel").textContent =
    `Category: ${cat.charAt(0).toUpperCase()+cat.slice(1)} | Difficulty: ${diff}`;

  // set up Play Again button
  document.getElementById("playAgainButton").onclick = () => generateWordSearch();
}

/* --- helper wrappers to keep naming consistent with earlier code --- */
function renderWordListToDOM(ws){
  const container = document.getElementById("wordListContainer");
  container.innerHTML = "";
  const title = document.createElement("div");
  title.innerHTML = "<strong>Words to Find:</strong>";
  container.appendChild(title);
  ws.forEach((w,i)=>{
    const chip = document.createElement("span");
    const colorClass = kidColors[i % kidColors.length];
    chip.className = `word-chip ${colorClass}`;
    chip.textContent = w;
    chip.dataset.word = w;
    container.appendChild(chip);
  });
}

/* assign colors to chosenWords similar to earlier function */
function assignColorsToChosenWords(ws){
  chosenWordColors = {};
  ws.forEach((w,i)=>{
    chosenWordColors[w] = {
      chipClass: kidColors[i % kidColors.length],
      highlightClass: neonClassForIndex(i),
      colorName: neonNames[i % neonNames.length]
    };
  });
}

/* wire UI */
document.getElementById("generateButton").addEventListener("click", generateWordSearch);
document.getElementById("playAgainButton").addEventListener("click", generateWordSearch);

/* init on load */
window.addEventListener("load", ()=> generateWordSearch());

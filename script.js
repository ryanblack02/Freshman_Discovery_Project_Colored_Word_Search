/* Animal Word Search — Safe & Optimized script.js */

const words = {
  mammals: {
    kid: ["dog","cat","cow","horse","pig","goat","sheep","bear","lion","tiger","zebra","panda","mouse","rat","bat","moose","otter","deer","fox","wolf"],
    adult: ["okapi","quoll","civet","pudu","takin","saiga","genet","dhole","kudu","tarsier","margay","xerus","manul","drill","eland","oryx","gerenuk","vicuña","hares","tule"]
  },
  birds: {
    kid: ["owl","duck","swan","eagle","crow","robin","sparrow","pigeon","dove","finch","heron","crane","parrot","goose","hawk","loon","stork","wren","tern","ibis"],
    adult: ["bustard","bittern","curlew","godwit","kestrel","harrier","oriole","skua","gannet","petrel","lapwing","magpie","redstart","pipit","warbler","siskin","shrike","vireo","wryneck","tanager"]
  },
  reptiles: {
    kid: ["snake","lizard","gecko","turtle","tortoise","iguana","skink","cobra","python","viper","chameleon","gator","croc","anole","boa","mamba","adder","terrapin","monitor","krait"],
    adult: ["agamid","basilisk","daygecko","glassfrog","caiman","gavial","iguanid","anaconda","bushviper","coralsnake","kingsnake","whipsnake","watersnake","wormsnake","brownanole","mudsnake","taipan","girdled","savanna","cantil"]
  },
  amphibians: {
    kid: ["frog","toad","newt","salamander","tadpole","axolotl","treefrog","bullfrog","mudpuppy","eft","spadefoot","peeper","glassfrog","ribbit","pickerel","coqui","springfrog","redback","toadlet","marshfrog"],
    adult: ["olm","sirens","caecilian","hellbender","mantella","darwinfrog","natterjack","firebelly","spadefoot","duskynewt","moorfrog","crestednewt","roughskinned","reedfrog","leaffrog","torrentfrog","riverfrog","brooknewt","puddletoad","palmfrog"]
  },
  fish: {
    kid: ["shark","tuna","trout","salmon","cod","bass","perch","guppy","carp","minnow","catfish","eel","pike","sturgeon","snapper","halibut","manta","ray","flounder","dory"],
    adult: ["tarpon","pollock","herring","mackerel","wahoo","lamprey","moray","sculpin","skate","char","wrasse","tilapia","sardine","anchovy","bonefish","snapper","arowana","grouper","parrotfish","trigger"]
  },
  insects: {
    kid: ["ant","bee","fly","wasp","moth","bug","roach","beetle","spider","caterpillar","cricket","dragonfly","ladybug","firefly","weevil","earwig","mayfly","mantis","locust","termite"],
    adult: ["aphid","katydid","caddis","dobson","thrips","ichneumon","fritfly","leafhopper","stonefly","tigerbeetle","sawfly","whirligig","greenfly","hornet","gnat","fruitfly","sandfly","stinkbug","damsel","silverfish"]
  },
  invertebrates: {
    kid: ["snail","slug","worm","crab","lobster","octopus","squid","clam","shrimp","urchin","jelly","anemone","sponge","starfish","coral","barnacle","mussel","scallop","krill","isopod"],
    adult: ["nudibranch","limpet","whelk","copepod","cuttle","mantis","krill","polychaete","hydra","seafoam","tunicate","bryozoan","sandworm","lugworm","featherworm","seaangel","seahare","nereis"]
  }
};

/* --- Config & Helpers --- */
const MIN_GRID = 15;
const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = max => Math.floor(Math.random() * max);
const normalizeWord = w => w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

/* --- State --- */
let currentGrid = null;
let cellElements = [];
let chosenWords = [];
let chosenWordColors = {};
let foundSet = new Set();
let isPointerDown = false;
let pointerStart = null;
let pointerLast = null;

/* --- Grid helpers --- */
function getGridSizeByWords(ws){
  const maxLen = Math.max(...ws.map(w=>w.length));
  return Math.max(MIN_GRID, maxLen + 3);
}

function createEmptyGrid(size){
  return Array.from({length:size}, ()=>Array(size).fill(""));
}

function fillEmptySpaces(grid){
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let r=0;r<grid.length;r++){
    for(let c=0;c<grid.length;c++){
      if(!grid[r][c]) grid[r][c] = randomChoice(alpha);
    }
  }
}

/* --- Place words --- */
function placeWord(grid, word){
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  const size = grid.length;
  const maxAttempts = 200;
  for(let attempt=0; attempt<maxAttempts; attempt++){
    const [dr,dc] = randomChoice(dirs);
    const row = randInt(size), col = randInt(size);
    const coords = [];
    let fits = true;
    for(let i=0;i<word.length;i++){
      const r=row+dr*i, c=col+dc*i;
      if(r<0||c<0||r>=size||c>=size){ fits=false; break; }
      const cell = grid[r][c];
      if(cell && cell !== word[i]) { fits=false; break; }
      coords.push([r,c]);
    }
    if(fits){
      coords.forEach(([r,c],i)=> grid[r][c]=word[i]);
      return true;
    }
  }
  console.warn("Failed placing", word);
  return false;
}

function placeAllWords(grid){
  for(const w of chosenWords){
    placeWord(grid,w);
  }
}

/* --- Rendering --- */
function renderGridToDOM(grid){
  const gridEl = document.getElementById("grid");
  gridEl.innerHTML = "";
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
  gridEl.style.gridTemplateColumns = `repeat(${grid.length}, min(40px,7vw))`;
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
  let r=r1, c=c1;
  while(true){
    if(r<0||c<0||r>=cellElements.length||c>=cellElements[0].length) break;
    path.push([r,c]);
    if(r===r2 && c===c2) break;
    r+=dr; c+=dc;
  }
  return path;
}

function getPathWord(r1,c1,r2,c2,grid){
  const path = getPath(r1,c1,r2,c2);
  let str = "";
  for(const [r,c] of path) str += grid[r][c];
  return str;
}

/* --- Temp highlight --- */
function clearTemp(){
  document.querySelectorAll(".cell").forEach(cell=>{
    cell.classList.remove("temp");
    Array.from(cell.classList).forEach(c=>{
      if(c.startsWith("highlight-") && !cell.classList.contains("glow")) cell.classList.remove(c);
    });
  });
}

function showTemp(r1,c1,r2,c2){
  clearTemp();
  if(!currentGrid) return;
  const path = getPath(r1,c1,r2,c2);
  if(path.length===0) return;
  let str = "";
  for(const [r,c] of path) str += currentGrid[r][c];
  let matchWord = null;
  for(const w of chosenWords){
    const rev = w.split("").reverse().join("");
    if(w===str || rev===str){ matchWord=w; break; }
  }
  const tempCls = matchWord ? chosenWordColors[matchWord].highlightClass : null;
  for(const [r,c] of path){
    const el = cellElements[r][c];
    if(!el) continue;
    el.classList.add("temp");
    if(tempCls && !el.classList.contains("glow")) el.classList.add(tempCls);
  }
}

/* --- Mark word found --- */
function markWordFound(word,r1,c1,r2,c2){
  if(foundSet.has(word)) return;
  const info = chosenWordColors[word];
  const cls = info ? info.highlightClass : null;
  const path = getPath(r1,c1,r2,c2);
  for(const [r,c] of path){
    const el = cellElements[r][c];
    if(!el) continue;
    if(cls) el.classList.add(cls);
    el.classList.add("glow");
    el.classList.remove("temp");
  }
  document.querySelectorAll(".word-chip").forEach(ch=>{
    if(ch.dataset.word===word) ch.classList.add("marked");
  });
  foundSet.add(word);
  if(foundSet.size===chosenWords.length) showCongratulations();
}

/* --- Congrats + confetti --- */
function showCongratulations(){
  const banner = document.getElementById("congratsBanner");
  if(!banner) return;
  banner.textContent="🎉 Congratulations! You found all the words!";
  banner.classList.add("show");

  try {
    confetti({particleCount:150, spread:100, origin:{y:0.35}});
    const end = Date.now() + 800;
    const frame = () => {
      confetti({particleCount:6, spread:60, origin:{x:Math.random(), y:Math.random()*0.6+0.2}});
      if(Date.now()<end) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  } catch(e){ console.warn("confetti failed:", e); }
}

function removeCongratsBanner(){
  const b = document.getElementById("congratsBanner");
  if(b) b.classList.remove("show");
}

/* --- DOM helpers --- */
function getCellFromPoint(x,y){
  const el = document.elementFromPoint(x,y);
  if(!el) return null;
  let node = el;
  while(node && node!==document.body){
    if(node.classList && node.classList.contains("cell")){
      const r=parseInt(node.dataset.row,10);
      const c=parseInt(node.dataset.col,10);
      if(Number.isFinite(r) && Number.isFinite(c)) return [r,c];
      return null;
    }
    node=node.parentElement;
  }
  return null;
}

/* --- Interaction handlers --- */
function initInteractionHandlers(){
  const gridEl = document.getElementById("grid");
  const getPointer = e => e.touches ? e.touches[0] : e;

  function down(e){
    if(!currentGrid) return;
    if(e.touches) e.preventDefault?.();
    isPointerDown=true;
    pointerStart=getCellFromPoint(getPointer(e).clientX,getPointer(e).clientY);
    pointerLast=pointerStart;
    if(pointerStart) showTemp(pointerStart[0], pointerStart[1], pointerStart[0], pointerStart[1]);
  }

  function move(e){
    if(!isPointerDown || !currentGrid) return;
    const c=getCellFromPoint(getPointer(e).clientX,getPointer(e).clientY);
    if(!c || !pointerStart) return;
    if(pointerLast && pointerLast[0]===c[0] && pointerLast[1]===c[1]) return;
    pointerLast=c;
    showTemp(pointerStart[0], pointerStart[1], pointerLast[0], pointerLast[1]);
  }

  function up(){
    if(!isPointerDown || !currentGrid) return;
    isPointerDown=false;
    if(pointerStart && pointerLast){
      const w = getPathWord(pointerStart[0],pointerStart[1],pointerLast[0],pointerLast[1],currentGrid);
      const rev = w.split("").reverse().join("");
      if(chosenWords.includes(w)) markWordFound(w,pointerStart[0],pointerStart[1],pointerLast[0],pointerLast[1]);
      else if(chosenWords.includes(rev)) markWordFound(rev,pointerStart[0],pointerStart[1],pointerLast[0],pointerLast[1]);
    }
    clearTemp();
    pointerStart=null;
    pointerLast=null;
  }

  gridEl.addEventListener("mousedown", down);
  gridEl.addEventListener("touchstart", down, {passive:false});
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
}

/* --- Generate puzzle --- */
function generateWordSearch(){
  removeCongratsBanner();
  foundSet = new Set();
  chosenWords = [];
  chosenWordColors = {};
  clearTemp();

  const cat = document.getElementById("categoryDropdown").value || "mammals";
  const diff = document.getElementById("difficultyDropdown").value || "kid";
  let pool = (words[cat] && words[cat][diff]) ? words[cat][diff].slice() : [];
  pool = pool.map(normalizeWord);
  pool = [...new Set(pool)]; // remove duplicates

  chosenWords = pool.sort(()=>0.5-Math.random()).slice(0,6);
  chosenWords.forEach((w,i)=> chosenWordColors[w]={highlightClass: neonClassForIndex(i)});

  const size = getGridSizeByWords(chosenWords);
  const grid = createEmptyGrid(size);
  placeAllWords(grid);
  fillEmptySpaces(grid);

  currentGrid = grid;
  renderGridToDOM(grid);
  renderWordList(chosenWords);
  document.getElementById("categoryLabel").textContent=`Category: ${cat} | Difficulty: ${diff}`;
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
  document.getElementById("generateButton").addEventListener("click", generateWordSearch);
  generateWordSearch();
});

/* ===========================
   Neon Word Search - script.js
   =========================== */

/* --- Word database (expanded) --- */
const words = {
  mammals: {
    kid: ["Dog","Cat","Cow","Horse","Pig","Sheep","Goat","Rabbit","Lion","Tiger",
          "Elephant","Bear","Monkey","Giraffe","Kangaroo","Panda","Zebra","Deer",
          "Fox","Wolf","Dolphin","Whale","Seal","Otter","Squirrel","Mouse","Rat",
          "Hedgehog","Bat","Raccoon","Moose","Buffalo","Hippo","Camel","Donkey","Cougar",
          "Beaver","Chinchilla","Ferret","Walrus"],
    adult: ["Aardvark","Aardwolf","Alpaca","Antelope","Bison","Capybara","Chimpanzee",
            "Cheetah","Dugong","Echidna","Fennecfox","Gerenuk","Hartebeest","Hyena",
            "Impala","Jackal","Koala","Lemur","Manatee","Meerkat","Moose","Narwhal",
            "Okapi","Platypus","Porcupine","Redpanda","Sloth","Tapir","Warthog",
            "Wolverine","Buffalo","Sable","Caribou","Pronghorn","Hippopotamus"]
  },
  birds: {
    kid: ["Chicken","Duck","Goose","Swan","Owl","Eagle","Hawk","Parrot","Penguin",
          "Flamingo","Peacock","Crow","Sparrow","Robin","Hummingbird","Toucan",
          "Woodpecker","Seagull","Pelican","Ostrich"],
    adult: ["Albatross","Cassowary","Cockatoo","Condor","Crane","Falcon","Heron",
            "Hornbill","Kingfisher","Kookaburra","Macaw","Nightingale","Quail",
            "Roadrunner","Shoebill","Marabou","Secretarybird","Bittern","Ibis"]
  },
  reptiles: {
    kid: ["Snake","Lizard","Turtle","Crocodile","Alligator","Chameleon","Gecko","Iguana"],
    adult: ["Komododragon","GarterSnake","Boa","Python","Anole","Tortoise","Monitor",
            "Caiman","Gavial","Viper","Skink","HornedLizard","WaterDragon"]
  },
  amphibians: {
    kid: ["Frog","Toad","Salamander","Newt"],
    adult: ["Axolotl","Caecilian","FireSalamander","Hellbender"]
  },
  fish: {
    kid: ["Goldfish","Shark","Tuna","Trout","Salmon","Clownfish","Catfish"],
    adult: ["Barracuda","Grouper","Swordfish","Anglerfish","Lionfish","Betta","Piranha",
            "Sturgeon","Marlin","Halibut","MahiMahi","Carp"]
  },
  insects: {
    kid: ["Ant","Bee","Butterfly","Beetle","Fly","Wasp","Grasshopper","Ladybug"],
    adult: ["Dragonfly","Cricket","Termite","Moth","Mosquito","PrayingMantis",
            "Cicada","Firefly","StickInsect","Earwig","Hornet"]
  },
  invertebrates: {
    kid: ["Snail","Worm","Jellyfish","Crab","Octopus","Starfish"],
    adult: ["Lobster","Scorpion","Coral","Anemone","Cuttlefish","Shrimp","Barnacle",
            "SeaUrchin","Squid","Clam"]
  }
};

/* --- Colors & helpers --- */
const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = max => Math.floor(Math.random() * max);

/* --- Grid helpers --- */
function getGridSizeByWords(ws) {
  const maxLen = Math.max(...ws.map(w => w.length));
  return Math.max(12, maxLen + 3);
}
function createEmptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(""));
}
function fillEmptySpaces(grid) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid.length; c++)
      if (!grid[r][c]) grid[r][c] = randomChoice(alpha);
}
function placeWord(grid, word) {
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  const size = grid.length;
  for (let attempt = 0; attempt < 400; attempt++) {
    const [dr, dc] = randomChoice(dirs);
    const row = randInt(size), col = randInt(size);
    const coords = [];
    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dr*i, c = col + dc*i;
      if (r<0||r>=size||c<0||c>=size) { fits=false; break; }
      if (grid[r][c] && grid[r][c]!==word[i]) { fits=false; break; }
      coords.push([r,c]);
    }
    if (!fits) continue;
    coords.forEach(([r,c],i)=>grid[r][c]=word[i]);
    return true;
  }
  console.warn("Couldn't place:", word);
  return false;
}

/* --- Globals --- */
let currentGrid=null, cellElements=[], chosenWords=[], chosenWordColors={}, foundSet=new Set();

/* --- Render --- */
function renderGridToDOM(grid){
  const gridEl = document.getElementById("grid");
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
    chip.textContent=w;
    chip.dataset.word=w;
    cont.appendChild(chip);
  });
}

/* --- Sparkles --- */
const sparkleContainer=document.getElementById("sparkles");
function makeSparkle(x,y,color){
  const s=document.createElement("div");
  s.style=`position: fixed; left:${x-6}px; top:${y-6}px; width:8px; height:8px; border-radius:50%; background:${color}; opacity:0.95; pointer-events:none; z-index:1200;`;
  sparkleContainer.appendChild(s);
  const dx=(Math.random()-0.5)*40, dy=-20-Math.random()*40;
  s.animate([{transform:"translate(0,0) scale(1)", opacity:1},{transform:`translate(${dx}px,${dy}px) scale(0.6)`,opacity:0}],{duration:800,easing:"ease-out"});
  setTimeout(()=>s.remove(),1000);
}

/* --- Audio --- */
let audioCtx;
function playDing(){
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.value=880;
    gain.gain.setValueAtTime(0.1,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.8);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime+0.8);
  }catch(e){}
}

/* --- Confetti --- */
function popConfetti(){
  const colors=["#ff4c4c","#4c8cff","#4cff72","#ffa64c","#c04cff","#ff6fcf"];
  for(let i=0;i<70;i++){
    const piece=document.createElement("div");
    piece.className="confetti";
    piece.style.background=randomChoice(colors);
    piece.style.left=(20+Math.random()*80)+"%";
    piece.style.top="-10%";
    piece.style.position="fixed"; piece.style.width="8px"; piece.style.height="8px"; piece.style.zIndex=2000;
    document.body.appendChild(piece);
    const dx=(Math.random()-0.5)*600, dy=600+Math.random()*400, rot=Math.random()*720;
    piece.animate([{transform:`translateY(0) rotate(0deg)`, opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`,opacity:0.9}],{duration:2500+Math.random()*1000,easing:"ease-in-out"});
    setTimeout(()=>piece.remove(),3500);
  }
}

/* --- Path helpers --- */
function getPathWord(r1,c1,r2,c2,grid){
  const dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  if(dr===0&&dc===0) return grid[r1][c1];
  let r=r1,c=c1,str="";
  while(true){
    if(r<0||c<0||r>=grid.length||c>=grid.length) return null;
    str+=grid[r][c];
    if(r===r2&&c===c2) break;
    r+=dr; c+=dc;
  }
  return str;
}

/* --- Interaction --- */
let isPointerDown=false, pointerStart=null, pointerLast=null;
function clearTemp(){ document.querySelectorAll(".cell.temp").forEach(el=>el.classList.remove("temp")); }
function showTemp(r1,c1,r2,c2){
  clearTemp();
  const dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  let r=r1,c=c1;
  while(true){
    if(r<0||c<0||r>=currentGrid.length||c>=currentGrid.length) break;
    const el=cellElements[r][c];
    if(el) el.classList.add("temp");
    if(r===r2&&c===c2) break;
    r+=dr;c+=dc;
  }
}
function markWordFound(word,r1,c1,r2,c2){
  const info=chosenWordColors[word], cls=info.highlightClass;
  let r=r1,c=c1, dr=Math.sign(r2-r1), dc=Math.sign(c2-c1);
  while(true){
    cellElements[r][c].classList.add(cls,"glow");
    if(r===r2&&c===c2) break;
    r+=dr;c+=dc;
  }
  document.querySelectorAll(".word-chip").forEach(ch=>{
    if(ch.dataset.word===word) ch.classList.add("marked");
  });
  foundSet.add(word);
  playDing();
  if(foundSet.size===chosenWords.length && chosenWords.length>0){
    document.getElementById("winOverlay").classList.remove("hidden");
    document.getElementById("winMessage").textContent="🎉 You found them all!";
    popConfetti();
  }
}

/* --- Enable pointer --- */
function enableInteraction(grid){
  currentGrid=grid;
  const el=document.getElementById("grid");
  function getPointer(e){ return (e.touches&&e.touches[0])||e; }
  function getCellFromPoint(x,y){
    const rect=el.getBoundingClientRect();
    if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom) return null;
    const cw=rect.width/grid.length, ch=rect.height/grid.length;
    return [Math.min(grid.length-1, Math.floor((y-rect.top)/ch)), Math.min(grid.length-1, Math.floor((x-rect.left)/cw))];
  }
  const down=e=>{
    isPointerDown=true;
    const p=getPointer(e); pointerStart=getCellFromPoint(p.clientX,p.clientY);
  };
  const move=e=>{
    if(!isPointerDown) return;
    const p=getPointer(e); pointerLast=getCellFromPoint(p.clientX,p.clientY);
    if(pointerStart && pointerLast) showTemp(pointerStart[0],pointerStart[1],pointerLast[0],pointerLast[1]);
  };
  const up=e=>{
    if(!isPointerDown) return;
    isPointerDown=false;
    if(pointerStart && pointerLast){
      const str=getPathWord(pointerStart[0],pointerStart[1],pointerLast[0],pointerLast[1],grid);
      const strRev=str.split("").reverse().join("");
      const found=chosenWords.find(w=>w.toUpperCase()===str||w.toUpperCase()===strRev);
      if(found) markWordFound(found,pointerStart[0],pointerStart[1],pointerLast[0],pointerLast[1]);
    }
    clearTemp();
    pointerStart=null; pointerLast=null;
  };
  el.addEventListener("mousedown",down); el.addEventListener("touchstart",down);
  el.addEventListener("mousemove",move); el.addEventListener("touchmove",move);
  el.addEventListener("mouseup",up); el.addEventListener("touchend",up);
}

/* --- Main generate function --- */
function generateWordSearch(category="mammals", difficulty="kid"){
  foundSet.clear();
  chosenWords=[];
  currentGrid=null;
  const pool=words[category][difficulty];
  chosenWords=pool.sort(()=>0.5-Math.random()).slice(0,6);
  chosenWordColors={};
  chosenWords.forEach((w,i)=>chosenWordColors[w]={highlightClass:neonClassForIndex(i)});
  const size=getGridSizeByWords(chosenWords);
  const grid=createEmptyGrid(size);
  chosenWords.forEach(w=>placeWord(grid,w.toUpperCase()));
  fillEmptySpaces(grid);
  renderGridToDOM(grid);
  renderWordList(chosenWords);
  enableInteraction(grid);
}

/* --- On load --- */
window.onload=()=>{ generateWordSearch("mammals","kid"); };

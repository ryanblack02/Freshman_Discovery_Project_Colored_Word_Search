/* ===========================
   Neon Word Search - script.js
   =========================== */

/* --- Word database --- */
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

/* --- Helpers --- */
const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = max => Math.floor(Math.random() * max);

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

/* --- Place words --- */
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

/* --- Globals --- */
let currentGrid=null, cellElements=[], chosenWords=[], chosenWordColors={}, foundSet=new Set();

/* --- Render --- */
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

/* --- Confetti + Congrats --- */
function showCongratulations(){
  // Remove old message if exists
  const oldMsg=document.getElementById("congratsMessage");
  if(oldMsg) oldMsg.remove();

  // Add new message
  const msg=document.createElement("div");
  msg.id="congratsMessage";
  msg.style="font-size:24px;color:#fff;text-align:center;margin:12px;";
  msg.textContent="🎉 Congratulations! You found all words!";
  document.body.insertBefore(msg, document.getElementById("boardWrap"));

  // Confetti
  const confettiRoot=document.getElementById("confetti");
  confettiRoot.innerHTML="";
  const colors=["#ff4c4c","#4c8cff","#4cff72","#ffa64c","#c04cff","#ff6fcf"];
  for(let i=0;i<70;i++){
    const piece=document.createElement("div");
    piece.className="confetti";
    piece.style.background=randomChoice(colors);
    piece.style.left=(20+Math.random()*60)+"%";
    piece.style.top="-10%";
    piece.style.position="fixed";
    piece.style.width="8px"; piece.style.height="8px";
    piece.style.zIndex=2000;
    document.body.appendChild(piece);
    const dx=(Math.random()-0.5)*600, dy=600+Math.random()*400, rot=Math.random()*720;
    piece.animate([
      {transform:"translateY(0) rotate(0deg)", opacity:1},
      {transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`, opacity:0.9}
    ], {duration:2500+Math.random()*1000, easing:"ease-in-out"});
    setTimeout(()=>piece.remove(),3500);
  }
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
  document.querySelectorAll(".word-chip").forEach(ch=>{ if(ch.dataset.word===word) ch.classList.add("marked"); });
  foundSet.add(word);
  if(foundSet.size===chosenWords.length) showCongratulations();
}

/* --- Enable pointer --- */
function enableInteraction(grid){
  currentGrid=grid;
  function getPointer(e){ return (e.touches?e.touches[0]:e); }
  function getCellFromPoint(x,y){
    const rect=document.getElementById("grid").getBoundingClientRect();
    if(x<rect.left||x>rect.right||y<rect.top||y>rect.bottom) return null;
    const cw=rect.width/grid.length, ch=rect.height/grid.length;
    return [Math.min(grid.length-1,Math.floor((y-rect.top)/ch)), Math.min(grid.length-1,Math.floor((x-rect.left)/cw))];
  }
  const down=e=>{ isPointerDown=true; const p=getPointer(e); pointerStart=getCellFromPoint(p.clientX,p.clientY); pointerLast=pointerStart; if(pointerStart) showTemp(...pointerStart,...pointerStart); }
  const move=e=>{ if(!isPointerDown) return; const p=getPointer(e); const c=getCellFromPoint(p.clientX,p.clientY); if(c) pointerLast=c, showTemp(...pointerStart,...pointerLast); }
  const up=e=>{ if(!isPointerDown) return; isPointerDown=false; if(pointerStart && pointerLast){ const w=getPathWord(...pointerStart,...pointerLast,grid); const rev=w.split("").reverse().join(""); if(chosenWords.includes(w)) markWordFound(w,...pointerStart,...pointerLast); else if(chosenWords.includes(rev)) markWordFound(rev,...pointerStart,...pointerLast); } clearTemp(); pointerStart=null; pointerLast=null; }
  window.addEventListener("mousedown",down); window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
  window.addEventListener("touchstart",down,{passive:false}); window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
}

/* --- Generate puzzle --- */
function generateWordSearch(){
  // Clear old confetti + congrats
  const old=document.getElementById("congratsMessage");
  if(old) old.remove();
  document.getElementById("confetti").innerHTML="";

  foundSet=new Set(); chosenWords=[]; chosenWordColors={};

  const cat=document.getElementById("categoryDropdown").value;
  const diff=document.getElementById("difficultyDropdown").value;
  let pool=(words[cat]&&words[cat][diff])?words[cat][diff].slice():[];
  pool=pool.map(w=>w.toUpperCase());
  chosenWords=pool.sort(()=>0.5-Math.random()).slice(0,6);
  chosenWords.forEach((w,i)=>chosenWordColors[w]={highlightClass:neonClassForIndex(i)});

  const size=getGridSizeByWords(chosenWords);
  const grid=createEmptyGrid(size);
  chosenWords.forEach(w=>placeWord(grid,w));
  fillEmptySpaces(grid);

  renderGridToDOM(grid);
  renderWordList(chosenWords);
  enableInteraction(grid);
  document.getElementById("categoryLabel").textContent=`Category: ${cat} | Difficulty: ${diff}`;
}

/* --- Init --- */
window.onload=()=>{ generateWordSearch(); document.getElementById("generateButton").onclick=generateWordSearch; };

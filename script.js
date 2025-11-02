/* ===========================
   Neon Word Search - script.js
   =========================== */

/* --- Word database (unchanged) --- */
const words = { ... }; // Keep the full words object as before

/* --- Colors & helpers --- */
const kidColors = ["color-red","color-blue","color-green","color-orange","color-purple","color-pink"];
const neonNames = ["red","blue","green","orange","purple","pink"];
const neonClassForIndex = i => `highlight-${neonNames[i % neonNames.length]}`;
const randomChoice = arr => arr[Math.floor(Math.random()*arr.length)];
const randInt = max => Math.floor(Math.random()*max);

/* --- Grid helpers (unchanged) --- */
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
  const dirs=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-

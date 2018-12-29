const boardWidth = 75;
const boardHeight = 75;
const scale = 10;

var prevBoard = [];
var nextBoard = [];
var playing = false;
var speed = 5;

var stepButton;
var pauseButton;
var resetButton;
var speedSlider;


function setup() {
  // size of canvas is dynamically calculated
  var canvas = createCanvas(boardWidth * scale, boardHeight * scale);

  // if the canvas is clicked it should flip the corresponding cell
  canvas.mouseClicked(flipCell);

  // setting up board completely empty
  setupBoard();

  // setting up buttons and callback functions
  stepButton = createButton("step");
  stepButton.mouseClicked(step);

  pauseButton = createButton("pause / play")
  pauseButton.mouseClicked(pause);

  resetButton = createButton("reset");
  resetButton.mouseClicked(reset);

  speedSlider = createSlider(1, 50, 5, 1);
  speedSlider.mouseMoved(changeSpeed);
}

// button helper / callback functions
function step() { calcBoard(); drawBoard(); }
function pause() { playing = !playing; }
function stop() { playing = false; }
function reset() { stop(); resetBoard(); }
function changeSpeed() { speed = speedSlider.value(); }
function flipCell() {
  stop();
  prevBoard[floor(mouseY / scale)][floor(mouseX / scale)] = !prevBoard[floor(mouseY / scale)][floor(mouseX / scale)];
  drawBoard();
}

function draw() {
  frameRate(speed);
  if (playing) {
    step();
  }
}

function setupBoard() {
  for (y = 0; y < boardHeight; y++) {
    prevBoard.push([]);
    nextBoard.push([]);
    for (x = 0; x < boardWidth; x++) {
      prevBoard[y].push(false);
      nextBoard[y].push(false);
    }
  }
  drawBoard();
}

function resetBoard() {
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      prevBoard[y][x] = false;
      nextBoard[y][x] = false;
    }
  }
  drawBoard();
}

function drawBoard() {
  noStroke();
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      fill(255);
      if (prevBoard[y][x]) { fill(0); }
      rect(x * scale, y * scale, scale, scale);
    }
  }
}

function calcBoard() {

  function countNeighbours(x, y) {
    var neighbours = 0;
    for (yOffset = -1; yOffset <= 1; yOffset++) {
      for (xOffset = -1; xOffset <= 1; xOffset++) {
        if (!(xOffset == 0 && yOffset == 0)) {
          if (prevBoard[y + yOffset][x + xOffset]) {
            neighbours++;
          }
        }
      }
    }
    return neighbours;
  }

  for (y = 1; y < boardHeight - 1; y++) {
    for (x = 1; x < boardWidth - 1; x++) {
      let neighbours = countNeighbours(x, y);
      if (prevBoard[y][x]) { // if cell is already alive
        if (neighbours == 2 || neighbours == 3) { // and it has 2 or 3 neighbours
          nextBoard[y][x] = true; // it stays alive
        } else { // else if it has more or less neighbours than that
          nextBoard[y][x] = false; // it dies
        }
      } else { // else if it is already dead
        if (neighbours == 3) { // and it has 3 neighbours
          nextBoard[y][x] = true; // a new one spawns
        }
      }
    }
  }

  // prevBoard = nextBoard; // idk why this doesn't work, so i have to assign each individual value in another loop:
  for (y = 1; y < boardHeight - 1; y++) {
    for (x = 1; x < boardWidth - 1; x++) {
      prevBoard[y][x] = nextBoard[y][x];
    }
  }
}

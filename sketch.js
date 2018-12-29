const boardWidth = 75;
const boardHeight = 75;
const scale = 10;
let gridWeight = 0;

var currBoard = [];
var nextBoard = [];
var playing = false;
var speed = 25;

var stepButton;
var pauseButton;
var resetButton;
var randomButton;
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

  randomButton = createButton("random");
  randomButton.mouseClicked(randomize);

  speedSlider = createSlider(1, 50, 25, 1);
  speedSlider.mouseMoved(changeSpeed);
}

// button helper / callback functions
function step() { calcBoard(); drawBoard(); }
function pause() { playing = !playing; }
function stop() { playing = false; }
function reset() { stop(); resetBoard(); }
function randomize() { stop(); randomizeBoard(); }
function changeSpeed() { speed = speedSlider.value(); }
function flipCell() {
  stop();
  currBoard[floor(mouseY / scale)][floor(mouseX / scale)] = !currBoard[floor(mouseY / scale)][floor(mouseX / scale)];
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
    currBoard.push([]);
    nextBoard.push([]);
    for (x = 0; x < boardWidth; x++) {
      currBoard[y].push(false);
      nextBoard[y].push(false);
    }
  }
  drawBoard();
}

function resetBoard() {
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      currBoard[y][x] = false;
      nextBoard[y][x] = false;
    }
  }
  drawBoard();
}

function randomizeBoard() {
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      currBoard[y][x] = random() <= 0.25;
    }
  }
  drawBoard();
}

function drawBoard() {
  noStroke();
  if (gridWeight > 0) { // if there should be a grid, then its weight is set accordingly
    strokeWeight(gridWeight);
    stroke(0);
  }
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      fill(255);
      if (currBoard[y][x]) { fill(0); }
      rect(x * scale + gridWeight / 2, y * scale + gridWeight / 2, scale - gridWeight, scale - gridWeight);
    }
  }
}

// function to calculate the next generation of the board
function calcBoard() {

  // closure, as knowing neighbours is only important to the calculating function
  function countNeighbours(x, y) {
    var neighbours = 0;
    let neighbourX;
    let neighbourY;

    for (yOffset = -1; yOffset <= 1; yOffset++) { // checking neighbours
      for (xOffset = -1; xOffset <= 1; xOffset++) { // with distance 1
        if (!(xOffset == 0 && yOffset == 0)) { // but not own cell!

          neighbourX = x + xOffset; // setting relative neighbour X Position
          if (neighbourX == -1) { neighbourX = boardWidth - 1 } // if neighbour is over the left edge look on the right edge
          else if (neighbourX == boardWidth) { neighbourX = 0 } // if neighbour is over the right edge look on the left edge

          neighbourY = y + yOffset; // setting relative neighbour Y Position
          if (neighbourY == -1) { neighbourY = boardHeight - 1 } // if neighbour is over the top edge look on the bottom edge
          else if (neighbourY == boardHeight) { neighbourY = 0 } // if neighbour is over the bottom edge look on the top edge

          if (currBoard[neighbourY][neighbourX]) { // if there is a neighbour at that neighbout position
            neighbours++; // then increment the neighbour count
          }

        }
      }
    }

    return neighbours;
  } // end closure

  for (y = 0; y < boardHeight; y++) { // going through all
    for (x = 0; x < boardWidth; x++) { // current cells...

      let neighbours = countNeighbours(x, y); // checking how many neighbours each one has and:

      if (currBoard[y][x]) { // if cell is already alive
        if (neighbours == 2 || neighbours == 3) { // and it has 2 or 3 neighbours
          nextBoard[y][x] = true; // it stays alive
        } else { // else if it has more or less neighbours than that
          nextBoard[y][x] = false; // it dies
        }
      } else { // else if it is already dead
        if (neighbours == 3) { // and it has exactly 3 neighbours
          nextBoard[y][x] = true; // a new one spawns
        }
      }

    }
  }

  // currBoard = nextBoard; // idk why this doesn't work, so i have to assign each individual value in another loop:
  for (y = 0; y < boardHeight; y++) {
    for (x = 0; x < boardWidth; x++) {
      currBoard[y][x] = nextBoard[y][x];
    }
  }
}

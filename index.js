let winHeight, 
winWidth, 
squareSize,
isNextMarkCircle,
isUserTurn,
isGameOver,
boardMap,
boardMapO,
boardMapX;

window.onload = function () {
    initBoard();
}

window.onresize = setBoardSize;

function initBoard() {
    setBoardSize();
    isNextMarkCircle = true;
    isUserTurn = true;
    isGameOver = false;
    document.getElementsByClassName("results__display")[0].innerHTML = "";
    for(let square in boardMap) {
        let div = document.getElementById(square);
        let canvas = div.children[0];
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    boardMap = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false
    }
    boardMapO = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false
    }
    boardMapX = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false 
    }
}

function setBoardSize() {
    winHeight = window.innerHeight;
    winWidth = window.innerWidth;
    squareSize = winHeight <= winWidth ? winHeight/2 : winWidth/2;
    
    let squares = document.getElementsByClassName("board__square");
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.height = squareSize + "px";
        squares[i].style.width = squareSize + "px";
    }
}
//refactor this so it be called by the user and computer
function selectSquare(event) {
    if(isUserTurn && !isGameOver) {
        let div = event.srcElement;

        if(!boardMap[div.id]) {
            drawSquare(div);
            if(!isGameOver) {
                isUserTurn = false;
                executeComputerMove().then(() => {
                    isUserTurn = true;
                });
            }
        }
    }
}

function drawSquare(div) {
    let canvas = div.children[0];
    let context = canvas.getContext("2d");
    context.lineWidth = 3;
    if(isNextMarkCircle){
        markO(context, div);
    }
    else {
        markX(context, div);
    }
    isNextMarkCircle = !isNextMarkCircle;
    boardMap[div.id] = true
    isGameOver = checkBoardState();
}

function markO(context, srcElement) {
    let modSide = context.canvas.width * 0.8;
    let radius = context.canvas.width / 2;

    context.beginPath (); 
    context.arc (radius, radius, modSide/2, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
    boardMapO[srcElement.id] = true;
}

function markX(context, srcElement) {
    let modSide = context.canvas.width * 0.8;

    context.beginPath();
    context.moveTo(context.canvas.width - modSide, context.canvas.height - modSide);
    context.lineTo(modSide, modSide);
    context.moveTo(modSide, context.canvas.height - modSide);
    context.lineTo(context.canvas.width - modSide, modSide);
    context.closePath();
    context.stroke();
    boardMapX[srcElement.id] = true;
}

async function executeComputerMove() {
    await new Promise(resolve => setTimeout(resolve, 100));
    let selectedSquare = calculateMove();
    drawSquare(document.getElementById(selectedSquare));
}

function calculateMove() {
// Define the winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Check if there is a winning move for the computer (O)
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (boardMapX[a] && boardMapX[b] && !boardMap[c]) {
      return c;
    }
    if (boardMapX[a] && !boardMap[b] && boardMapX[c]) {
      return b;
    }
    if (!boardMap[a] && boardMapX[b] && boardMapX[c]) {
      return a;
    }
  }

  // Check if there is a winning move for the player (X)
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (boardMapO[a] && boardMapO[b] && !boardMap[c]) {
      return c;
    }
    if (boardMapO[a] && !boardMap[b] && boardMapO[c]) {
      return b;
    }
    if (!boardMap[a] && boardMapO[b] && boardMapO[c]) {
      return a;
    }
  }

  // Check if the center square is available
  if (!boardMap[4]) {
    return 4;
  }

  // Check the corners
  if (!boardMap[0]) {
    return 0;
  }
  if (!boardMap[2]) {
    return 2;
  }
  if (!boardMap[6]) {
    return 6;
  }
  if (!boardMap[8]) {
    return 8;
  }

  // If all else fails, make a random move
    let availableSquares = [];
    for(let square in boardMap) {
        if(!boardMap[square]){
            availableSquares.push(square);
        }
    }
    let selectedSquare = getRandomInt(0, availableSquares.length - 1);
    return availableSquares[selectedSquare];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkBoardState() {
    let resultsDiv = document.getElementsByClassName("results__display")[0];

    if(
        boardMap[0] &&
        boardMap[1] &&
        boardMap[2] &&
        boardMap[3] &&
        boardMap[4] &&
        boardMap[5] &&
        boardMap[6] &&
        boardMap[7] &&
        boardMap[8]
    ) {
        resultsDiv.innerHTML = "Draw";
        return "draw";
    }
    if(
        boardMapO[0] && boardMapO[1] && boardMapO[2] ||
        boardMapO[3] && boardMapO[4] && boardMapO[5] ||
        boardMapO[6] && boardMapO[7] && boardMapO[8] ||
        boardMapO[0] && boardMapO[3] && boardMapO[6] ||
        boardMapO[1] && boardMapO[4] && boardMapO[7] ||
        boardMapO[2] && boardMapO[5] && boardMapO[8] ||
        boardMapO[0] && boardMapO[4] && boardMapO[8] ||
        boardMapO[6] && boardMapO[4] && boardMapO[2]
    ) {
        resultsDiv.innerHTML = "O wins";
        return "win";
    }
    if(
        boardMapX[0] && boardMapX[1] && boardMapX[2] ||
        boardMapX[3] && boardMapX[4] && boardMapX[5] ||
        boardMapX[6] && boardMapX[7] && boardMapX[8] ||
        boardMapX[0] && boardMapX[3] && boardMapX[6] ||
        boardMapX[1] && boardMapX[4] && boardMapX[7] ||
        boardMapX[2] && boardMapX[5] && boardMapX[8] ||
        boardMapX[0] && boardMapX[4] && boardMapX[8] ||
        boardMapX[6] && boardMapX[4] && boardMapX[2]
    ) {
        resultsDiv.innerHTML = "X wins";
        return "win";
    }
    return null;
}

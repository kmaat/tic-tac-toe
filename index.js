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
    for(let square in boardMap) {
        document.getElementById(square).innerHTML = " ";
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
    div.innerHTML=`<canvas 
        width="${div.clientWidth}" 
        height="${div.clientHeight}" 
        style="z-index:-1;position:relative;width:100%;height:100%;" 
    /canvas>`;
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
    let resultsDiv = document.getElementsByClassName("board__results")[0];
    if(!false in boardMap) {
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

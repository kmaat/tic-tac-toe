let winHeight, winWidth, squareSize;
let isNextMarkCircle = true;
let isUserTurn = true;
let boardMap = {
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

window.onload = function () {
    setBoardSize();
}

window.onresize = setBoardSize;

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
    let div = event.srcElement;
    if(boardMap[div.id]) {
        // div.innerHTML = " ";
    }
    else {
        div.innerHTML=`<canvas 
            width="${div.clientWidth}" 
            height="${div.clientHeight}" 
            style="z-index:-1;position:relative;width:100%;height:100%;" 
        /canvas>`;
        let canvas = div.children[0];
        let context = canvas.getContext("2d");
        context.lineWidth = 3;
        if(isNextMarkCircle){
            markO(context);
        }
        else {
            markX(context);
        }
        isNextMarkCircle = !isNextMarkCircle;
        boardMap[div.id] = !boardMap[div.id];
        isUserTurn = !isUserTurn;
        calculateMove();
    }
}

function markO(context) {
    let modSide = context.canvas.width * 0.8;
    let radius = context.canvas.width / 2;

    context.beginPath (); 
    context.arc (radius, radius, modSide/2, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
}

function markX(context) {
    let modSide = context.canvas.width * 0.8;

    context.beginPath();
    context.moveTo(context.canvas.width - modSide, context.canvas.height - modSide);
    context.lineTo(modSide, modSide);
    context.moveTo(modSide, context.canvas.height - modSide);
    context.lineTo(context.canvas.width - modSide, modSide);
    context.closePath();
    context.stroke();
}

function calculateMove() {
    let availableSquares = 9;
    for(let square in boardMap) {
        if(boardMap[square]) availableSquares--;
    }
    console.log(availableSquares);
}

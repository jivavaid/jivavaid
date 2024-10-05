// Snake Game
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas.getContext('2d');
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = {};
let snakeScore = 0;
let snakeInterval;

function initSnake() {
    placeFood();
    snakeInterval = setInterval(updateSnake, 100);
    document.addEventListener('keydown', changeSnakeDirection);
}

function placeFood() {
    food.x = Math.floor(Math.random() * (snakeCanvas.width / 10)) * 10;
    food.y = Math.floor(Math.random() * (snakeCanvas.height / 10)) * 10;
}

function changeSnakeDirection(event) {
    switch (event.key) {
        case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    }
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x * 10, y: snake[0].y + direction.y * 10 };

    if (head.x < 0 || head.x >= snakeCanvas.width || head.y < 0 || head.y >= snakeCanvas.height || collisionWithSnake(head)) {
        clearInterval(snakeInterval);
        alert('Game Over! Your score: ' + snakeScore);
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        document.getElementById('snakeScore').innerText = 'Score: ' + snakeScore;
        placeFood();
    } else {
        snake.pop();
    }

    drawSnake();
}

function collisionWithSnake(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function drawSnake() {
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    snake.forEach(segment => {
        snakeCtx.fillStyle = 'green';
        snakeCtx.fillRect(segment.x, segment.y, 10, 10);
    });
    snakeCtx.fillStyle = 'red';
    snakeCtx.fillRect(food.x, food.y, 10, 10);
}

function restartSnake() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    snakeScore = 0;
    document.getElementById('snakeScore').innerText = 'Score: 0';
    clearInterval(snakeInterval);
    initSnake();
}

// Tic Tac Toe Game
const tttBoard = document.getElementById('tttBoard');
const tttMessage = document.getElementById('tttMessage');
let tttCurrentPlayer = 'X';
let tttGameBoard = ['', '', '', '', '', '', '', '', ''];
let tttGameActive = false;

function createTTTBoard() {
    tttBoard.innerHTML = '';
    tttGameBoard.forEach((_, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', index);
        cell.addEventListener('click', handleTTTCellClick);
        tttBoard.appendChild(cell);
    });
    tttGameActive = true;
}

function handleTTTCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (tttGameBoard[index] !== '' || !tttGameActive) {
        return;
    }

    cell.textContent = tttCurrentPlayer;
    tttGameBoard[index] = tttCurrentPlayer;
    checkTTTResult();
}

function checkTTTResult() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (tttGameBoard[a] === '' || tttGameBoard[b] === '' || tttGameBoard[c] === '') {
            continue;
        }
        if (tttGameBoard[a] === tttGameBoard[b] && tttGameBoard[a] === tttGameBoard[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        tttMessage.innerText = `Player ${tttCurrentPlayer} wins!`;
        tttGameActive = false;
        return;
    }

    if (!tttGameBoard.includes('')) {
        tttMessage.innerText = 'Game ended in a draw!';
        tttGameActive = false;
        return;
    }

    tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
}

function restartTicTacToe() {
    tttCurrentPlayer = 'X';
    tttGameBoard = ['', '', '', '', '', '', '', '', ''];
    tttMessage.innerText = '';
    createTTTBoard();
}

createTTTBoard();

// Gun Shot Game
const gunContainer = document.getElementById('gunContainer');
const target = document.getElementById('target');
let gunScoreValue = 0;

function startGunShotGame() {
    moveTarget();
    document.addEventListener('click', shootTarget);
}

function moveTarget() {
    const x = Math.random() * (gunContainer.clientWidth - 30);
    const y = Math.random() * (gunContainer.clientHeight - 30);
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    target.style.display = 'block';
}

function shootTarget(event) {
    const targetRect = target.getBoundingClientRect();
    const clickX = event.clientX;
    const clickY = event.clientY;

    if (
        clickX >= targetRect.left &&
        clickX <= targetRect.right &&
        clickY >= targetRect.top &&
        clickY <= targetRect.bottom
    ) {
        gunScoreValue++;
        document.getElementById('gunScore').innerText = 'Score: ' + gunScoreValue;
        moveTarget();
    }
}

function restartGunShot() {
    gunScoreValue = 0;
    document.getElementById('gunScore').innerText = 'Score: 0';
    moveTarget();
    startGunShotGame();
}

function startGame(game) {
    document.querySelectorAll('.game').forEach(g => g.style.display = 'none');
    document.getElementById(game).style.display = 'block';

    if (game === 'snake') {
        restartSnake();
    } else if (game === 'tictactoe') {
        restartTicTacToe();
    } else if (game === 'gunshot') {
        restartGunShot();
    }
}

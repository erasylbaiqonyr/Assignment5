
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;
const START_NUMBER = 50;
const START_LIVES = 3;
const WIN_STREAK_BONUS = 1;

let currentNumber = START_NUMBER;
let lives = START_LIVES;
let streak = 0;
let bestStreak = 0;
let gameOver = false;

const numberElement = document.querySelector("#currentNumber");
const livesElement = document.querySelector("#lives");
const streakElement = document.querySelector("#streak");
const bestStreakElement = document.querySelector("#bestStreak");
const gameMessage = document.querySelector("#gameMessage");
const higherBtn = document.querySelector("#higherBtn");
const lowerBtn = document.querySelector("#lowerBtn");
const restartGame = document.querySelector("#restartGame");

function randomNumber() {
    return Math.floor(
        Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)
    ) + MIN_NUMBER;
}

function renderGame() {
    numberElement.textContent = currentNumber;
    livesElement.textContent = lives;
    streakElement.textContent = streak;
    bestStreakElement.textContent = bestStreak;

    higherBtn.disabled = gameOver;
    lowerBtn.disabled = gameOver;
}

function finishGame() {
    gameOver = true;

    if (lives === 0 || streak >= MAX_NUMBER) {
        gameMessage.textContent =
            `Game over! Your streak: ${streak}. Press Restart Game.`;
    }

    renderGame();
}

function makeGuess(direction) {
    if (gameOver) {
        gameMessage.textContent =
            "The game has ended. Press Restart Game.";
        return;
    }

    if (direction !== "higher" && direction !== "lower") {
        gameMessage.textContent = "Invalid move!";
        return;
    }

    const nextNumber = randomNumber();

    const isCorrect =
        (direction === "higher" && nextNumber >= currentNumber) ||
        (direction === "lower" && nextNumber <= currentNumber);

    if (isCorrect === true) {
        streak += WIN_STREAK_BONUS;

        if (streak > bestStreak) {
            bestStreak = streak;
        }

        gameMessage.textContent =
            `Correct! ${currentNumber} → ${nextNumber}.`;
    } else {
        lives -= 1;
        streak = 0;

        gameMessage.textContent =
            `Wrong! ${currentNumber} → ${nextNumber}. You lost one life.`;
    }

    currentNumber = nextNumber;

    if (lives === 0 || currentNumber < MIN_NUMBER ||
        currentNumber > MAX_NUMBER) {
        finishGame();
    } else {
        renderGame();
    }
}

higherBtn.addEventListener("click", function () {
    makeGuess("higher");
});

lowerBtn.addEventListener("click", function () {
    makeGuess("lower");
});

restartGame.addEventListener("click", function () {
    currentNumber = START_NUMBER;
    lives = START_LIVES;
    streak = 0;
    gameOver = false;

    gameMessage.textContent =
        "New game! Choose Higher or Lower.";

    renderGame();
});

renderGame();

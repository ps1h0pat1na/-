document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreBoard = document.getElementById("scoreBoard");
    const databaseDisplay = document.getElementById("databaseDisplay");
    const showDatabaseBtn = document.getElementById("showDatabase");
    const resetDatabaseBtn = document.getElementById("resetDatabase");
    const startGameBtn = document.getElementById("startGame");
    const countdownTimer = document.getElementById("countdownTimer");

    canvas.width = 600;
    canvas.height = 400;

    const unit = 20;
    let snake = [{ x: unit * 5, y: unit * 5 }];
    let apple = generateApple();
    let direction = { x: 0, y: 0 };
    let score = 0;
    let gameInterval;

    // Инициализация базы данных либо из localStorage, либо пустой массив
    const database = JSON.parse(localStorage.getItem('snakeGameDatabase')) || [];

    function generateApple() {
        return {
            x: Math.floor(Math.random() * (canvas.width / unit)) * unit,
            y: Math.floor(Math.random() * (canvas.height / unit)) * unit,
        };
    }

    function drawObject(color, x, y) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, unit, unit);
    }

    function drawSnake() {
        snake.forEach(part => drawObject("lime", part.x, part.y));
    }

    function drawApple() {
        drawObject("red", apple.x, apple.y);
    }

    function updateSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);

        if (head.x === apple.x && head.y === apple.y) {
            apple = generateApple();
            score++;
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        clearInterval(gameInterval);
        let playerName = prompt("Игра окончена! Введите ваше имя:");
        if (playerName) {
            database.push({ name: playerName, score: score });
            localStorage.setItem('snakeGameDatabase', JSON.stringify(database));
        }
        displayDatabase();
    }

    function displayDatabase() {
        databaseDisplay.innerHTML = "<h2>Результаты:</h2>";
        databaseDisplay.innerHTML += "<ul>";
        database.forEach(entry => {
            databaseDisplay.innerHTML += `<li>${entry.name}: ${entry.score}</li>`;
        });
        databaseDisplay.innerHTML += "</ul>";
        databaseDisplay.style.display = "block";
    }

    function resetDatabase() {
        localStorage.removeItem('snakeGameDatabase');
        database.length = 0; // Очищаем текущий массив базы данных
        displayDatabase();
    }

    function countdownAndStart() {
        let countdown= 3;
        countdownTimer.innerText = countdown;

        const timerInterval = setInterval(() => {
            countdown--;
            countdownTimer.innerText = countdown;

            if (countdown === 0) {
                clearInterval(timerInterval);
                countdownTimer.innerText = "";
                startGame();
            }
        }, 1000);
    }

    function startGame() {
        snake = [{ x: unit * 5, y: unit * 5 }];
        direction = { x: 0, y: 0 };
        score = 0;
        gameInterval = setInterval(gameLoop, 100);
    }

    function gameLoop() {
        if (checkCollision()) {
            gameOver();
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawApple();
        drawSnake();
        updateSnake();

        scoreBoard.innerText = `Счет: ${score}`;
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                if (direction.y === 0) direction = { x: 0, y: -unit };
                break;
            case "ArrowDown":
                if (direction.y === 0) direction = { x: 0, y: unit };
                break;
            case "ArrowLeft":
                if (direction.x === 0) direction = { x: -unit, y: 0 };
                break;
            case "ArrowRight":
                if (direction.x === 0) direction = { x: unit, y: 0 };
                break;
        }
    });

    showDatabaseBtn.addEventListener("click", displayDatabase);
    resetDatabaseBtn.addEventListener("click", resetDatabase);
    startGameBtn.addEventListener("click", countdownAndStart);
});

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startGame");
    const playerNameInput = document.getElementById("playerName");
    const gameCanvas = document.getElementById("gameCanvas");
    let playerName = "";

    startButton.addEventListener("click", () => {
        if (playerName === "") {
            playerName = playerNameInput.value.trim();
            if (playerName === "") {
                alert("Пожалуйста, введите ваше имя.");
            } else {
                playerNameInput.disabled = true; // Блокируем поле ввода
                startButton.disabled = true; // Блокируем кнопку
                startGame(playerName);
            }
        }
    });
});

function startGame(playerName) {
    console.log(`Игра началась для игрока: ${playerName}`);
    // Здесь начинается логика игры
    // Например, отрисовка на canvas
    const ctx = document.getElementById('gameCanvas').getContext('2d');
    ctx.fillText(`Привет, ${playerName}!`, 10, 50);

    // Продолжение вашей игры...
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startGame");
    const playerNameInput = document.getElementById("playerName");
    const difficultyRadios = document.getElementsByName("difficulty");
    const gameCanvas = document.getElementById("gameCanvas");
    let playerName = "";
    let difficulty = "easy";

    startButton.addEventListener("click", () => {
        if (playerName === "") {
            playerName = playerNameInput.value.trim();
            if (playerName === "") {
                alert("Пожалуйста, введите ваше имя.");
                return;
            }
        }
        for (const radio of difficultyRadios) {
            if (radio.checked) {
                difficulty = radio.value;
                break;
            }
        }
        playerNameInput.disabled = true;
        startButton.disabled = true;
        startGame(playerName, difficulty);
    });
});

function startGame(playerName, difficulty) {
    console.log(`Игра началась для игрока: ${playerName} с уровнем сложности: ${difficulty}`);
    const ctx = document.getElementById('gameCanvas').getContext('2d');

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.font = '20px Arial';  // Добавляем шрифт
    ctx.fillText(`Привет, ${playerName}! Уровень: ${difficulty}`, 10, 50);

    let speed;
    if (difficulty === "easy") {
        speed = 2;
    } else if (difficulty === "medium") {
        speed = 5;
    } else if (difficulty === "hard") {
        speed = 10;
    }
    console.log(`Selected game speed: ${speed}`);  // Выводим скорость игры в консоль
    // Продолжение вашей логики игры в зависимости от выбранного уровня сложности
}

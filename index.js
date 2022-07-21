const car = new Image();
const road = new Image();
const asphalt = new Image();
const stopSignal = new Image();
car.src = "./car.png";
stopSignal.src = "./stop.png";
road.src = "./road.png";
asphalt.src = "./asphalt.png";

let canvas = document.getElementById("game");
let context = canvas.getContext("2d");
// Размер одной клеточки на поле — 16 пикселей
let grid = 16;
// Служебная переменная, которая отвечает за скорость змейки
let count = 0;
let delay = 4;
// А вот и сама змейка
let snake = {
  // Начальные координаты
  x: 200,
  y: 0,
  // Скорость змейки — в каждом новом кадре змейка смещается по оси Х или У. На старте будет двигаться горизонтально, поэтому скорость по игреку равна нулю.
  dx: 0,
  dy: grid,
  // Тащим за собой хвост, который пока пустой
  cells: [],
  // Стартовая длина змейки — 4 клеточки
  maxCells: 1,
};
let userPosition = "right";

// Игровой цикл — основной процесс, внутри которого будет всё происходить
const loop = () => {
  const { cells } = snake;
  // Хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15 (60/15 = 4)
  requestAnimationFrame(loop);
  // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет
  if (++count < 4) {
    return;
  }
  // Обнуляем переменную скорости
  count = 0;
  // Очищаем игровое поле
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Двигаем змейку с нужной скоростью
  snake.x += snake.dx;
  snake.y += snake.dy;

  // проверка на пересечение пользователя и ветки
  // Если змейка достигла края поля по горизонтале — удаляю первый элемент

  if (snake.y >= canvas.height) {
    cells.shift();
  }

  // delay отвечает отложенный запуск ветки/стены
  delay = delay - 1;

  if (delay === 0) {
    delay = 4;
  }

  // условие добавление ветки
  if (Math.random() > 0.5 && delay === 1) {
    const wallDirection = Math.random() > 0.5 ? "left" : "right";

    cells.push({
      x: snake.x,
      y: snake.y,
      wallDirection,
    });
  } else {
    cells.push({
      x: snake.x,
      y: snake.y,
    });
  }

  const arr = cells.map((el) => ({ ...el, y: snake.y - el.y }));
  const currentWall = arr.find((el) => el.wallDirection);

  // проверка на пересечение ветки и пользователя
  if (
    currentWall &&
    currentWall.wallDirection === userPosition &&
    currentWall.y === canvas.clientHeight - 56
  ) {
    alert("Game over");
  }

  // Одно движение змейки — один новый нарисованный квадратик
  arr.forEach((cell) => {
    // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
    if (cell.wallDirection) {
      if (cell.wallDirection === "left") {
        context.drawImage(stopSignal, cell.x - grid, cell.y, grid, grid);
        context.drawImage(asphalt, cell.x, cell.y, grid, grid);
      } else {
        context.drawImage(stopSignal, cell.x, cell.y, grid, grid);
        context.drawImage(asphalt, cell.x - 16, cell.y, grid, grid);
      }
    } else {
      context.drawImage(road, cell.x - 16, cell.y, grid * 2, grid);
    }
  });

  // отображаем пользователя
  context.fillStyle = "yellow";
  if (userPosition === "left") {
    context.drawImage(car, snake.x - grid, canvas.clientHeight - 50, 20, 50);
  } else {
    context.drawImage(car, snake.x, canvas.clientHeight - 50, 20, 50);
  }
};

// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener("keydown", function (e) {
  if (e.which === 37) {
    userPosition = "left";
  }
  // Стрелка вправо
  else if (e.which === 39) {
    userPosition = "right";
  }
});
// Запускаем игру
requestAnimationFrame(loop);

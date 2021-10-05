const board = document.querySelector('.board')
const ctx = board.getContext('2d')

const BOARD_BG = 'white'
const GRID_SIZE = 400

board.width = board.height = GRID_SIZE

let score = 0
let scoreMultiplier = 1

let changingDirection = false

const snake = {
  coords: [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
  ],
  dx: 10,
  dy: 0,
  color: 'green',
  border: undefined,
}

const food = {
  x: 0,
  y: 0,
  color: 'red',
  border: undefined,
}

const difficulty = {
  EASY: 150,
  NORMAL: 100,
  HARD: 50,
  HACKER: 10,
}

const key = {
  UP: 'ArrowUp',
  LEFT: 'ArrowLeft',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
}

document.addEventListener('keydown', e => {
  if (changingDirection) return
  changingDirection = true
  const keyPressed = e.key
  const goingUp = snake.dy === -10
  const goingDown = snake.dy === 10
  const goingRight = snake.dx === 10
  const goingLeft = snake.dx === -10
  if (keyPressed === key.UP && !goingDown) {
    snake.dx = 0
    snake.dy = -10
  }
  if (keyPressed === key.LEFT && !goingRight) {
    snake.dx = -10
    snake.dy = 0
  }
  if (keyPressed === key.DOWN && !goingUp) {
    snake.dx = 0
    snake.dy = 10
  }
  if (keyPressed === key.RIGHT && !goingLeft) {
    snake.dx = 10
    snake.dy = 0
  }
})

const drawSnake = () => {
  snake.coords.forEach(drawSnakePart)
}

const drawFood = () => {
  ctx.fillStyle = food.color
  ctx.fillRect(food.x, food.y, 10, 10)
}

const drawSnakePart = snakePart => {
  ctx.fillStyle = snake.color
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
}

const moveSnake = () => {
  const head = {
    x: snake.coords[0].x + snake.dx,
    y: snake.coords[0].y + snake.dy,
  }
  snake.coords.unshift(head)
  const hasEatenFood =
    snake.coords[0].x === food.x && snake.coords[0].y === food.y
  if (hasEatenFood) {
    score += scoreMultiplier
    genFood()
  } else {
    snake.coords.pop()
  }
}

const hasGameEnded = () => {
  for (let i = 4; i < snake.coords.length; i++) {
    if (
      snake.coords[i].x === snake.coords[0].x &&
      snake.coords[i].y === snake.coords[0].y
    )
      return true
  }
  const hitLeftWall = snake.coords[0].x < 0
  const hitRightWall = snake.coords[0].x > board.width - 10
  const hitTopWall = snake.coords[0].y < 0
  const hitBottomWall = snake.coords[0].y > board.height - 10
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
  // if (hitLeftWall) return 1
  // if (hitRightWall) return 2
  // if (hitTopWall) return 3
  // if (hitBottomWall) return 4
  return false
}

const hasGameEndedAllowWallCollide = () => {
  for (let i = 4; i < snake.coords.length; i++) {
    if (
      snake.coords[i].x === snake.coords[0].x &&
      snake.coords[i].y === snake.coords[0].y
    )
      return true
  }
  const hitLeftWall = snake.coords[0].x < 0
  const hitRightWall = snake.coords[0].x > board.width - 10
  const hitTopWall = snake.coords[0].y < 0
  const hitBottomWall = snake.coords[0].y > board.height - 10
  if (hitLeftWall) return 1
  if (hitRightWall) return 2
  if (hitTopWall) return 3
  if (hitBottomWall) return 4
  return false
}

const genFood = () => {
  food.x = randomFood(0, board.width - 10)
  food.y = randomFood(0, board.height - 10)
  snake.coords.forEach(part => {
    const hasEaten = part.x === food.x && part.y === food.y
    if (hasEaten) genFood()
  })
}

const clearBoard = () => {
  ctx.fillStyle = BOARD_BG
  ctx.fillRect(0, 0, board.width, board.height)
}

const randomFood = (min, max) => {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

const drawScore = () => {
  ctx.font = '16px serif'
  ctx.fillText(`Score: ${score}`, board.height - 70, 15)
}

const gameOver = () => {
  const snake = document.querySelector('.snake')
  snake.innerHTML = `
    <div class="game-over">
      <div>GAME OVER!</div>
      <div>Score: ${score}</div>
      <button class='restart'>RESTART</button>
    </div>
  `
  document.querySelector('.restart').addEventListener('click', () => {
    location.reload()
  })
}

const main = () => {
  switch (hasGameEnded()) {
    // case 1:
    //   snake.coords[0].x += board.width + 10
    //   moveSnake()
    //   break
    // case 2:
    //   snake.coords[0].x -= board.width + 10
    //   moveSnake()
    //   break
    // case 3:
    //   snake.coords[0].y += board.width + 10
    //   moveSnake()
    //   break
    // case 4:
    //   snake.coords[0].y -= board.width + 10
    //   moveSnake()
    //   break
    case true:
      return gameOver()
    case false:
      break
  }
  if (hasGameEnded()) return
  changingDirection = false
  setTimeout(() => {
    clearBoard()
    drawFood()
    moveSnake()
    drawSnake()
    drawScore()
    main()
  }, difficulty.NORMAL)
}

main()
genFood()


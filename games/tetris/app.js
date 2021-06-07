document.addEventListener('DOMContentLoaded', () =>{
  const GRID_WIDTH = 1

  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0;
  let timerId




  //Tetris block code
  const lBlock = [
    [1, width+1, width*2+1, 2], 
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zBlock = [
    [2, width+1, width+2, width*2+1],
    [width, width+1, width*2+1, width*2+2],
    [2, width+1, width+2, width*2+1],
    [width, width+1, width*2+1, width*2+2]
  ]

  const sBlock = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]
  
  const tBlock = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oBlock = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iBlock = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theBlocks = [lBlock, zBlock, sBlock, tBlock, oBlock, iBlock]

  let currentPosition = 4
  let currentRotation = 0


  //Random block
  let random = Math.floor(Math.random() * theBlocks.length)
  let current = theBlocks[random][currentRotation]


  //Draw tetris block
  function draw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.add('block')
    })
  }
 
  //Undraw tetris block
  function undraw(){
    current.forEach( index => {
      squares[currentPosition + index].classList.remove('block')
    })
  }
  
    //assign functions to keycodes
    function control(e) {
      if(e.keyCode === 37){
        moveLeft()
      } else if(e.keyCode === 38){
        rotate()
      } else if(e.keyCode === 39){
        moveRight()
      } else if(e.keycode === 40){
        moveDown()
      }
  
    }
    document.addEventListener('keyup', control)

  //Function to move blocks down every time increment
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })

  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //Function to stop block from falling
  //Once it satisfies the condition to stop falling, the current block must be set to the index taken so that other blocks will not pass through previous blocks
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theBlocks.length)
      current = theBlocks[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()

    }
  }

  //Function to move block to the left unless it reaches the edge of the grid
  function moveLeft() {
    undraw()
    //isAtLeftEdge checks if the current block has any squares in the far left indices 
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge){
      currentPosition -= 1
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition += 1
    }
    draw()
  }

  //Function to move block to the right unless it reaches the edge of the grid
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if(!isAtRightEdge){
      currentPosition += 1
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -= 1
    }
    draw()
  }


    ///Code to fix bug when rotating blocks at edge of grid
    function isAtRight() {
      return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
      return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
      P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
      if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()){            //use actual position to check if it's flipped over to right side
          currentPosition += 1    //if so, add one to wrap it back around
          checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
          }
      }
      else if (P % width > 5) {
        if (isAtLeft()){
          currentPosition -= 1
        checkRotatedPosition(P)
        }
      }
    }

  //Function to rotate block
  function rotate() {
    undraw()
    currentRotation ++
    //if statement checks if block is at the end of the rotation so it goes back to the first rotation
    if(currentRotation === current.length){
      currentRotation = 0
    }
    current = theBlocks[random][currentRotation]
    checkRotatedPosition()
    draw()
  }


  //code to show next block
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0
  const upNextBlock = [
    [1, displayWidth+1, displayWidth*2+1, 2], 
    [2, displayWidth+1, displayWidth+2, displayWidth*2+1],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
  ]

  //function to display next block in mini-grid
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('block')
      // square.getElementsByClassName.backgroundColor = ''
    })
    upNextBlock[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('block')
      // displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }
})
const player1 = {
  name: 'Player 1',
  scoreId: 'player1Score',
  icon: 'O',
  iconColor: 'red',
  score: 0,
};
const player2 = {
  name: 'Player 2',
  scoreId: 'player2Score',
  icon: 'X',
  iconColor: 'blue',
  score: 0,
};
let player1Turn = true;
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = document.querySelectorAll('.cell');
let tttBoard;
function startGame() {
  let playerName;
  if (player1Turn) playerName = player1.name;
  else playerName = player2.name;

  document.querySelector('#end-game').innerText = playerName + ' Turn';
  document.querySelector('#end-game').style.display = 'grid';
  tttBoard = new Array(9).fill('');
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', squaretoId, false);
    cells[i].style.cursor = 'pointer';
  }
}

startGame();
function squaretoId(square) {
  clickBoard(square.target.id);
}
function clickBoard(squareId) {
  let currentPlayer;
  if (player1Turn) currentPlayer = player1;
  else currentPlayer = player2;
  let clickedCell = document.getElementById(squareId);
  if (clickedCell.style.cursor === 'pointer') {
    document.querySelector('#end-game').style.display = 'none';
    clickedCell.innerText = currentPlayer.icon;
    tttBoard[squareId] = currentPlayer.icon;

    clickedCell.style.cursor = 'not-allowed';
    clickedCell.style.color = currentPlayer.iconColor;
    player1Turn = !player1Turn;
    if (checkWin(player1)) gameOver(player1);
    else if (checkWin(player2)) gameOver(player2);
  }
}
function gameOver(player) {
  document.getElementById(player.scoreId).innerText = ++player.score;
  let endGame = document.querySelector('#end-game');
  endGame.style.display = 'grid';
  endGame.innerText = `${player.name} has Won!`;
  cells.forEach(cell => (cell.style.cursor = 'default'));
}
function checkWin(player) {
  for (let i = 0; i < winCombos.length; i++) {
    let win = 0;
    for (let k = 0; k < winCombos[i].length; k++) {
      if (tttBoard[winCombos[i][k]] === player.icon) win++;
      if (win === 3) {
        for (let l = 0; l < 3; l++) {
          cells[[winCombos[i][l]]].style.backgroundColor =
            'rgba(0, 255, 0, 0.3)';
        }
        return true;
      }
    }
  }
  return false;
}
// function checkTie() {
//   let temp = '';
//   for (let i = 0; i < tttBoard.length; i++) {
//     if (tttBoard[i] === '') temp += i;
//   }

//   if (temp.length !== 1) return false;

//   let currentPlayer;
//   if (player1Turn) currentPlayer = player1;
//   else currentPlayer = player2;

//   tttBoard[parseInt(temp)] = currentPlayer.icon;

//   if (checkWin(currentPlayer)) return false;
//   return true;
// }
/*
function checkTie() {
    let unwinnableCombo = 0;
    for (let i = 0; i < winCombos.length; i++) {
        let tempX =0
        let tempY = 0;
        for (let k = 0; k <winCombos[i].length; k++) {
            let tempwinCombosCell = winCombos[i][k];
            if (tttBoard[tempwinCombosCell] === 'X') tempX++;
            if (tttBoard[tempwinCombosCell] === 'O') tempY++;
            console.log(tttBoard[winCombos[i][k]])
            console.log('tempX is ' + tempX );
            console.log('tempY is ' + tempY);
        }
        if (tempX > 0 && tempY > 0) unwinnableCombo++;
        console.log(unwinnableCombo);
    }
    if (unwinnableCombo ===winCombos.length) return true;
    return false;
}
*/

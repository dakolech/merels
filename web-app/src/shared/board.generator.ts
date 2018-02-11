import { PLAYER1, PLAYER2 } from './game.helpers';

const pawnBox = '*';
const horizontalConnection = '-';
const verticalConnection = '|';
const newLine = '!';
// PLAYER1 pawns: 0 - is not in mill, 1 - is in one mill, 2 - is in two mills
// PLAYER2 pawns: 5 - is not in mill, 6 - is in one mill, 7 - is in two mills

const nineMerelsBoard = `
0-----*-----*!
|     |     |!
| *---*---* |!
| |   |   | |!
| | *-*-* | |!
| | |   | | |!
*-*-*   *-*-*!
| | |   | | |!
| | *-*-* | |!
| |   |   | |!
| *---*---* |!
|     |     |!
*-----*-----*!
`;

// const nineMerelsBoardMini = `
// *--*--*!
// |*-*-*|!
// ||***||!
// *** ***!
// ||***||!
// |*-*-*|!
// *--*--*!
// `;

// function optimize(boardString) {
//   const board = boardString.replace(/(\r\n|\n|\r)/gm, '').split(newLine).filter(Boolean);
//   const neutralValues = [horizontalConnection, verticalConnection, ' '];
//   const rowsToSlice = board
//     .map((val, index) =>
//       val
//         .split('')
//         .every(item => neutralValues
//         .includes(item)) ?
//           index :
//           false,
//     )
//     .filter(Boolean);

//   const numberArray = Array.from({ length: board[0].length }, (_, i) => i);

//   const columnsToSlice = numberArray
//     .map(index =>
//       board
//         .map(item => item[index])
//         .every(item => neutralValues
//         .includes(item)) ?
//           index :
//           false,
//     )
//     .filter(Boolean);

//   return board
//     .filter((val, index) => !rowsToSlice.includes(index))
//     .map(val => val
//       .split('')
//       .filter((_, index) => !columnsToSlice.includes(index))
//       .join(''),
//     );
// }

export interface BoardCell {
  isPawnBox: boolean;
  N: boolean;
  S: boolean;
  W: boolean;
  E: boolean;
  pawn: string;
  row: number;
  column: number;
  isHighlighted: boolean;
  isInMill: number;
  id: string;
}

export type BoardColumn = BoardCell[];
export type Board = BoardCell[][];
export type BoardToDraw = string[][];

function isPawnBox(char: string|boolean) {
  return char === pawnBox || (Number(char) >= 0 && char !== ' ');
}

export function generateBoard(boardString: string): Board {
  const splittedBoard: string[] = boardString.replace(/(\r\n|\n|\r)/gm, '').split(newLine).filter(Boolean);
  const horizontalSize = splittedBoard.length;
  const verticalSize = splittedBoard[0].length;
  let generatedBoard: Board = Array.from({ length: verticalSize }, () => Array.from({ length: horizontalSize }));

  for (let vertIndex = 0; vertIndex < verticalSize; vertIndex++) {
    for (let horIndex = 0; horIndex < horizontalSize; horIndex++) {
      const char = splittedBoard[horIndex][vertIndex];
      const westChar = vertIndex > 0 ? splittedBoard[horIndex][vertIndex - 1] : false;
      const eastChar = vertIndex < verticalSize - 1 ? splittedBoard[horIndex][vertIndex + 1] : false;
      const northChar = horIndex > 0 ? splittedBoard[horIndex - 1][vertIndex] : false;
      const southChar = horIndex < horizontalSize - 1 ? splittedBoard[horIndex + 1][vertIndex] : false;
      generatedBoard[vertIndex][horIndex] = {
        isPawnBox: isPawnBox(char),
        N: northChar === verticalConnection || (isPawnBox(northChar) && char === verticalConnection),
        S: southChar === verticalConnection || (isPawnBox(southChar) && char === verticalConnection),
        W: westChar === horizontalConnection || (isPawnBox(westChar) && char === horizontalConnection),
        E: eastChar === horizontalConnection || (isPawnBox(eastChar) && char === horizontalConnection),
        pawn: Number(char) > 4 ? PLAYER2 : (Number(char) >= 0 && char !== ' ') ? PLAYER1 : '',
        row: horIndex,
        column: vertIndex,
        isHighlighted: false,
        isInMill: (Number(char) >= 0 && char !== ' ') ? Number(char) % 5 : 0,
        id: `${horIndex}-${vertIndex}`
      };
    }
  }
  return generatedBoard;
}

function getIconName(box: BoardCell): string {
  return ['W', 'E', 'N', 'S']
    .reduce(
      (acc, curr) => box[curr] ? acc + curr.toLowerCase() : acc,
      ''
    );
}

function convertToDraw(boardObj: Board): BoardToDraw {
  return boardObj.map((column: BoardColumn) => column.map((box: BoardCell) => getIconName(box)));
}

export const board = generateBoard(nineMerelsBoard);
export const boardToDraw = convertToDraw(board);

export const playerPawns = 9;
export const millSize = 3;

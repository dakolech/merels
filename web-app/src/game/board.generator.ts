const pawnBox = '*';
const horizontalConnection = '-';
const verticalConnection = '|';
const newLine = '!';

const nineMerelsBoard = `
*-----*-----*!
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

function generateBoard(boardString: string): Board {
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
        isPawnBox: char === pawnBox,
        N: northChar === verticalConnection || (northChar === pawnBox && char === verticalConnection),
        S: southChar === verticalConnection || (southChar === pawnBox && char === verticalConnection),
        W: westChar === horizontalConnection || (westChar === pawnBox && char === horizontalConnection),
        E: eastChar === horizontalConnection || (eastChar === pawnBox && char === horizontalConnection),
        pawn: '',
        row: horIndex,
        column: vertIndex,
        isHighlighted: false,
        isInMill: 0,
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

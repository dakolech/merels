import { PLAYERS } from './game.helpers';
import { contains } from 'ramda';

const emptyPawnBox = '*';
const horizontalConnection = '-';
const verticalConnection = '|';
const newLine = '!';

export enum PawnBox {
  P1_NOT_MILL = '0',
  P1_ONE_MILL = '1',
  P1_TWO_MILLS = '2',
  P1_NOT_MILL_H = '3',
  P1_ONE_MILL_H = '4',
  P1_TWO_MILLS_H = '5',
  P2_NOT_MILL = '8',
  P2_ONE_MILL = '9',
  P2_TWO_MILLS = 'A',
  P2_NOT_MILL_H = 'B',
  P2_ONE_MILL_H = 'C',
  P2_TWO_MILLS_H = 'D',
}

const highLightedBoxes: PawnBox[] = [
  PawnBox.P1_NOT_MILL_H, PawnBox.P1_ONE_MILL_H, PawnBox.P1_TWO_MILLS_H,
  PawnBox.P2_NOT_MILL_H, PawnBox.P2_ONE_MILL_H, PawnBox.P2_TWO_MILLS_H,
];

const inOneMillBoxes: PawnBox[] = [
  PawnBox.P1_ONE_MILL, PawnBox.P1_ONE_MILL_H,
  PawnBox.P2_ONE_MILL, PawnBox.P2_ONE_MILL_H,
];

const inTwoMillsBoxes: PawnBox[] = [
  PawnBox.P1_TWO_MILLS, PawnBox.P1_TWO_MILLS_H,
  PawnBox.P2_TWO_MILLS, PawnBox.P2_TWO_MILLS_H,
];

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
  includedMills: number;
  id: string;
}

export type BoardColumn = BoardCell[];
export type Board = BoardCell[][];
export type BoardToDraw = string[][];

function isPawnBox(char: string|undefined): boolean {
  return char === emptyPawnBox || (parseInt(char as string, 16) >= 0 && char !== ' ');
}

function isHighLighted(char: string): boolean {
  return contains(char, highLightedBoxes);
}

function howManyMills(char: string): number {
  if (contains(char, inOneMillBoxes)) {
    return 1;
  }

  if (contains(char, inTwoMillsBoxes)) {
    return 2;
  }

  return 0;
}

function isPlayer2Pawn(char: string): boolean {
  return parseInt(char, 16) >= 8;
}

function isPlayer1Pawn(char: string): boolean {
  return parseInt(char, 16) >= 0 && parseInt(char, 16) < 8;
}

export function generateBoard(boardString: string): Board {
  const splittedBoard: string[] = boardString.replace(/(\r\n|\n|\r)/gm, '').split(newLine).filter(Boolean);
  const horizontalSize = splittedBoard.length;
  const verticalSize = splittedBoard[0].length;
  let generatedBoard: Board = Array.from({ length: verticalSize }, () => Array.from({ length: horizontalSize }));

  for (let vertIndex = 0; vertIndex < verticalSize; vertIndex++) {
    for (let horIndex = 0; horIndex < horizontalSize; horIndex++) {
      const char = splittedBoard[horIndex][vertIndex];
      const westChar = vertIndex > 0 ? splittedBoard[horIndex][vertIndex - 1] : undefined;
      const eastChar = vertIndex < verticalSize - 1 ? splittedBoard[horIndex][vertIndex + 1] : undefined;
      const northChar = horIndex > 0 ? splittedBoard[horIndex - 1][vertIndex] : undefined;
      const southChar = horIndex < horizontalSize - 1 ? splittedBoard[horIndex + 1][vertIndex] : undefined;
      generatedBoard[vertIndex][horIndex] = {
        isPawnBox: isPawnBox(char),
        N: northChar === verticalConnection || (isPawnBox(northChar) && char === verticalConnection),
        S: southChar === verticalConnection || (isPawnBox(southChar) && char === verticalConnection),
        W: westChar === horizontalConnection || (isPawnBox(westChar) && char === horizontalConnection),
        E: eastChar === horizontalConnection || (isPawnBox(eastChar) && char === horizontalConnection),
        pawn: isPlayer2Pawn(char) ? PLAYERS.P_2 : isPlayer1Pawn(char) ? PLAYERS.P_1 : '',
        row: horIndex,
        column: vertIndex,
        isHighlighted: isHighLighted(char),
        includedMills: howManyMills(char),
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

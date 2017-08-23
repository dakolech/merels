import { put, takeEvery, select, throttle } from 'redux-saga/effects';
import {
  NEXT_MOVE, setPawn, nextPlayer, removePawnFromHand, setNextMoveText, setMillInBox,
  changeActionType, highlightAvailablePawns, removePawnFromBoard, cleanHighlightedPawns,
  cachePawnPosition, highlightAvailableBox, removeMillInBox, highlightAllAvailableBoxes,
  setWinner, decreasePawnsFromBoard, CALL_BOX_SIZE, setBoxSize
} from './game.actions';
import { putPawnMessage, removePawnMessage, selectPawnMessage, movePawnMessage,
  setWinnerMessage } from './game.messages';
import { PLAYER1, PLAYER2, PUT_ACTION, TAKE_ACTION, MOVE_ACTION, SELECT_TO_MOVE,
  TAKE_AFTER_MOVE_ACTION, SELECT_TO_JUMP, END_GAME, GameState } from './game.reducer';
import { Board, BoardCell } from './board.generator';
import { path, evolve, inc, append, assocPath, pipe, map, unnest } from 'ramda';

export interface SimpleCell {
  column: number;
  row: number;
}

interface PawnCounter {
  counter: number;
  boxes: number[][];
}

interface MillObject {
  N: PawnCounter;
  S: PawnCounter;
  W: PawnCounter;
  E: PawnCounter;
}

function getNextBox(board: Board, currentBox: BoardCell, direction: string): BoardCell {
  const tempBox = {
    N: path([currentBox.column, currentBox.row - 1]),
    S: path([currentBox.column, currentBox.row + 1]),
    E: path([currentBox.column + 1, currentBox.row]),
    W: path([currentBox.column - 1, currentBox.row]),
  };
  return tempBox[direction](board);
}

function countPawnsInLine(
  board: Board,
  player: string,
  selectedBox: BoardCell,
  direction: string,
  acc: PawnCounter = { counter: 0, boxes: [] }
): PawnCounter {
  let newAcc = acc;
  if (selectedBox.pawn === player) {
    newAcc = evolve(
      {
        counter: inc,
        boxes: append([selectedBox.column, selectedBox.row])
      },
      newAcc
    );
  }
  if (!selectedBox[direction]) {
    return newAcc;
  }

  return countPawnsInLine(board, player, getNextBox(board, selectedBox, direction), direction, newAcc);
}

function findMill(board: Board, selectedBox: BoardCell, player: string, cachedPawn?: BoardCell): MillObject {
  const newBoard = cachedPawn ?
    assocPath([cachedPawn.column, cachedPawn.row, 'pawn'], undefined, board)
    : board;
  return {
    N: countPawnsInLine(newBoard, player, selectedBox, 'N'),
    S: countPawnsInLine(newBoard, player, selectedBox, 'S'),
    E: countPawnsInLine(newBoard, player, selectedBox, 'E'),
    W: countPawnsInLine(newBoard, player, selectedBox, 'W'),
  };
}

function isLineMill(millObject: MillObject, direction1: string, direction2: string, millSize: number): boolean {
  return path<number>([direction1, 'counter'], millObject) +
    path<number>([direction2, 'counter'], millObject) >=
    (millSize - 1);
}

function setMillInBoxes(millObject: MillObject, direction: string) {
  return pipe(
    path([direction, 'boxes']),
    map(item => put(setMillInBox({ column: item[0], row: item[1] })))
  )(millObject);
}

function countAvailablePawns(board: Board, player: string): number {
  return board
    .reduce(
      (accPar, currPar) =>
        currPar.reduce(
          (acc, curr) =>
            curr.pawn === player && curr.isInMill === 0 ? acc + 1 : acc,
          accPar),
      0);
}

function findAvailableBox(
  board: Board, selectedBox: BoardCell, direction: string
): SimpleCell {
  const newBox = getNextBox(board, selectedBox, direction);
  if (!newBox || !selectedBox[direction]) {
    return { column: -1, row: -1 };
  }
  if (newBox.isPawnBox && !newBox.pawn) {
    return {
      column: newBox.column,
      row: newBox.row,
    };
  }

  if (newBox.isPawnBox && !!newBox.pawn) {
    return { column: -1, row: -1 };
  }

  return findAvailableBox(board, newBox, direction);
}

function findAvailableBoxes(board: Board, selectedBox: BoardCell) {
  return [
    findAvailableBox(board, selectedBox, 'N'),
    findAvailableBox(board, selectedBox, 'S'),
    findAvailableBox(board, selectedBox, 'E'),
    findAvailableBox(board, selectedBox, 'W'),
  ]
    .filter(({ column, row }) => column !== -1 && row !== -1)
    .map(({ column, row }) => put(highlightAvailableBox({ column, row })));
}

function findExistedMill(
  board: Board, selectedBox: BoardCell, direction: string, acc: SimpleCell[] = []
): SimpleCell[] {
  const newBox = getNextBox(board, selectedBox, direction);
  let newAcc = acc;
  if (!newBox || !selectedBox[direction]) {
    return newAcc;
  }
  if (newBox.isInMill > 0) {
    newAcc = [...acc, {
      column: newBox.column,
      row: newBox.row,
    }];
  }

  return findExistedMill(board, newBox, direction, newAcc);
}

function removeMillOnTheBoard(board: Board, selectedBox: BoardCell) {
  return pipe(
    unnest,
    map((item: SimpleCell) => put(removeMillInBox({ column: item.column, row: item.row })))
  )([
    findExistedMill(board, selectedBox, 'N'),
    findExistedMill(board, selectedBox, 'S'),
    findExistedMill(board, selectedBox, 'E'),
    findExistedMill(board, selectedBox, 'W'),
  ]);
}

function* findMillOnTheBoard(
  board: Board, selectedBox: BoardCell, player: string, millSize: number, cachedPawn?: BoardCell
) {
  const millObject = findMill(board, selectedBox, player, cachedPawn);
  const isVerticalMill = isLineMill(millObject, 'N', 'S', millSize);
  const isHorizontalMill = isLineMill(millObject, 'E', 'W', millSize);

  if (isVerticalMill) {
    yield setMillInBoxes(millObject, 'N');
    yield setMillInBoxes(millObject, 'S');
  }

  if (isHorizontalMill) {
    yield setMillInBoxes(millObject, 'E');
    yield setMillInBoxes(millObject, 'W');
  }
  return isVerticalMill || isHorizontalMill;
}

function* handleTakeMove(
  board: Board, opponent: string, column: number, row: number, playerName: string, action: string
) {
  const availableOpponentPawns = countAvailablePawns(board, opponent);

  if (availableOpponentPawns > 0) {
    yield put(setMillInBox({ column, row }));
    yield put(setNextMoveText({ text: removePawnMessage(playerName) }));
    yield put(changeActionType({ type: action }));
    yield put(highlightAvailablePawns({ player: opponent }));
  }
}

function* nextMove(action: any) {
  const { row, column } = action.payload as SimpleCell;
  const state: GameState = yield select();
  const player: string = path(['game', 'currentPlayer'], state);
  const opponent = player === PLAYER1 ? PLAYER2 : PLAYER1;
  const pawnsInHand: number = path(['game', player, 'pawnsInHand'], state);
  const opponentPawnsInHand: number = path(['game', opponent, 'pawnsInHand'], state);
  const pawnsOnBoard: number = path(['game', player, 'pawnsOnBoard'], state);
  const opponentPawnsOnBoard: number = path(['game', opponent, 'pawnsOnBoard'], state);
  const opponentName: string = path(['game', opponent, 'name'], state);
  const playerName: string = path(['game', player, 'name'], state);
  const board: Board = path(['game', 'board'], state);
  const millSize: number = path(['game', 'millSize'], state);
  const currentAction: string = path(['game', 'currentAction'], state);
  const selectedBox: BoardCell = path([column, row], board);
  const cachedPawn: BoardCell = path(['game', 'cacheSelectedPawn'], state);
  const moveOrJump = (pawns: number) => pawns === 3 ? SELECT_TO_JUMP : SELECT_TO_MOVE;

  if (pawnsInHand > 0 && currentAction === PUT_ACTION && !selectedBox.pawn) {
    yield put(setPawn({ row, column }));
    yield put(removePawnFromHand({ player }));
    if (pawnsInHand <= 7) {
      const isMill = yield findMillOnTheBoard(board, selectedBox, player, millSize);

      if (isMill) {
        yield handleTakeMove(board, opponent, column, row, playerName, TAKE_ACTION);
      } else {
        yield put(setNextMoveText({ text: putPawnMessage(opponentName) }));
        yield put(nextPlayer());
      }
      if (opponentPawnsInHand === 0 && pawnsInHand === 1 && !isMill) {
        yield put(changeActionType({ type: SELECT_TO_MOVE }));
        yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      }
    } else {
      yield put(setNextMoveText({ text: putPawnMessage(opponentName) }));
      yield put(nextPlayer());
    }
  }

  if (currentAction === TAKE_ACTION &&
    selectedBox.pawn &&
    selectedBox.isHighlighted &&
    selectedBox.isInMill === 0
  ) {
    yield put(removePawnFromBoard({ row, column, player: opponent }));
    yield put(decreasePawnsFromBoard({ player: opponent }))
    if (opponentPawnsInHand === 0 && pawnsInHand === 0) {
      yield put(changeActionType({ type: SELECT_TO_MOVE }));
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    } else {
      yield put(setNextMoveText({ text: putPawnMessage(opponentName) }));
      yield put(changeActionType({ type: PUT_ACTION }));
    }
    yield put(cleanHighlightedPawns());
    yield put(nextPlayer());

    if (opponentPawnsInHand === 0 && pawnsInHand === 1 && currentAction !== TAKE_ACTION) {
      yield put(changeActionType({ type: moveOrJump(opponentPawnsOnBoard) }));
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
    }
  }

  if ((currentAction === SELECT_TO_MOVE || currentAction === SELECT_TO_JUMP) && selectedBox.pawn === player) {
    let availableBoxes = { length: 1 };
    if (pawnsOnBoard === 3) {
      yield put(highlightAllAvailableBoxes());
    } else {
      availableBoxes = yield findAvailableBoxes(board, selectedBox);
    }
    if (availableBoxes.length > 0) {
      yield put(cachePawnPosition({ row, column }));
      yield put(changeActionType({ type: MOVE_ACTION }));
      yield put(setNextMoveText({ text: movePawnMessage(playerName) }));
    }
  }

  if (currentAction === MOVE_ACTION && selectedBox.pawn === player) {
    yield put(cleanHighlightedPawns());
    if (pawnsOnBoard === 3) {
      yield put(highlightAllAvailableBoxes());
    } else {
      yield findAvailableBoxes(board, selectedBox);
    }
    yield put(cachePawnPosition({ row, column }));
  }

  if (currentAction === MOVE_ACTION && selectedBox.isHighlighted) {
    yield put(removePawnFromBoard({ row: cachedPawn.row, column: cachedPawn.column, player }));
    yield put(setPawn({ row, column }));
    yield put(cleanHighlightedPawns());

    const cachedPawnBox: BoardCell = path([cachedPawn.column, cachedPawn.row], board);
    if (cachedPawnBox.isInMill > 0) {
      yield put(removeMillInBox({ row: cachedPawnBox.row, column: cachedPawnBox.column }));
      yield removeMillOnTheBoard(board, cachedPawnBox);
    }
    const isMill = yield findMillOnTheBoard(board, selectedBox, player, millSize, cachedPawn);

    if (isMill) {
      yield handleTakeMove(board, opponent, column, row, playerName, TAKE_AFTER_MOVE_ACTION);
    } else {
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      yield put(changeActionType({ type: moveOrJump(opponentPawnsOnBoard) }));
      yield put(nextPlayer());
    }
  }

  if (currentAction === TAKE_AFTER_MOVE_ACTION &&
    selectedBox.pawn &&
    selectedBox.isHighlighted &&
    selectedBox.isInMill === 0
  ) {
    yield put(removePawnFromBoard({ row, column, player: opponent }));
    yield put(decreasePawnsFromBoard({ player: opponent }))
    if (opponentPawnsOnBoard === 3) {
      yield put(setWinner({ player }));
      yield put(setNextMoveText({ text: setWinnerMessage(playerName) }));
      yield put(cleanHighlightedPawns());
      yield put(changeActionType({ type: END_GAME }));
    } else {
      yield put(setNextMoveText({ text: selectPawnMessage(opponentName) }));
      yield put(changeActionType({ type: moveOrJump(opponentPawnsOnBoard) }));
      yield put(cleanHighlightedPawns());
      yield put(nextPlayer());
    }
  }
}

function* boxSizeChanged(action: any) {
  yield put(setBoxSize({ boxSize: action.payload.boxSize }))
}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
  yield throttle(2000, CALL_BOX_SIZE, boxSizeChanged);
}

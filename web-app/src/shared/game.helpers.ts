import { Board, BoardToDraw } from './board.generator';

export const PLAYER1 = 'PLAYER1';
export const PLAYER2 = 'PLAYER2';
export const PUT_ACTION = 'PUT_ACTION';
export const TAKE_ACTION = 'TAKE_ACTION';
export const SELECT_TO_MOVE = 'SELECT_TO_MOVE';
export const SELECT_TO_JUMP = 'SELECT_TO_JUMP';
export const MOVE_ACTION = 'MOVE_ACTION';
export const TAKE_AFTER_MOVE_ACTION = 'TAKE_AFTER_MOVE_ACTION';
export const END_GAME = 'END_GAME';

export interface PLAYER {
  pawnsInHand: number;
  pawnsOnBoard: number;
  color: string;
  name: string;
}

export interface GameState {
  board: Board;
  boardToDraw: BoardToDraw;
  currentPlayer: string;
  currentAction: string;
  boxSize: number;
  nextMove: string;
  millSize: number;
  cacheSelectedPawn: SimpleCell;
  winner: string;
  PLAYER1: PLAYER;
  PLAYER2: PLAYER;
}

export interface SimpleCell {
  column: number;
  row: number;
}

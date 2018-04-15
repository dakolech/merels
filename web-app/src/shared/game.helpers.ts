import { Board, BoardToDraw } from './board.generator';

export enum PLAYERS {
  P_1 = 'PLAYER1',
  P_2 = 'PLAYER2',
}

export enum ACTIONS {
  PUT = 'PUT_ACTION',
  TAKE = 'TAKE_ACTION',
  SELECT_TO_MOVE = 'SELECT_TO_MOVE',
  SELECT_TO_JUMP = 'SELECT_TO_JUMP',
  MOVE = 'MOVE_ACTION',
  TAKE_AFTER_MOVE = 'TAKE_AFTER_MOVE_ACTION',
  END_GAME = 'END_GAME',
}

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

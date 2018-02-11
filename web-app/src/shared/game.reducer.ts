import { board, playerPawns, boardToDraw, millSize, BoardCell } from './board.generator';
import {
  SET_PAWN, NEXT_PLAYER, REMOVE_PAWN_FROM_HAND, REMOVE_PAWN_FROM_BOARD,
  SET_NEXT_MOVE_TEXT, SET_MILL_IN_BOX, CHANGE_ACTION_TYPE, HIGHLIGHT_AVAILABLE_PAWN,
  CLEAN_HIGHLIGHTED_PAWNS, HIGHLIGHT_AVAILABLE_BOX, CACHE_PAWN_POSITION, REMOVE_MILL_IN_BOX,
  HIGHLIGHT_ALL_AVAILABLE_BOXES, SET_WINNER, RESET_GAME, SetPawnType, PlayerPawnType, NextMoveType, ActionType,
  PlayerType, DECREASE_PAWNS_FROM_BOARD, SET_BOX_SIZE
} from './game.actions';
import { putPawnMessage } from './game.messages';
import { assocPath, evolve, dec, inc, pipe, assoc, adjust } from 'ramda';
import { GameState, PLAYER1, PLAYER2, PUT_ACTION } from './game.helpers';

export const initialStateGame: GameState = {
  board,
  boardToDraw,
  PLAYER1: {
    pawnsInHand: playerPawns,
    pawnsOnBoard: 0,
    color: '#00F',
    name: 'Player 1',
  },
  PLAYER2: {
    pawnsInHand: playerPawns,
    pawnsOnBoard: 0,
    color: '#0F0',
    name: 'Player 2',
  },
  currentPlayer: PLAYER1,
  currentAction: PUT_ACTION,
  boxSize: 0,
  nextMove: putPawnMessage('Player 1'),
  millSize,
  cacheSelectedPawn: {
    column: -1,
    row: -1,
  },
  winner: '',
};

// tslint:disable-next-line:no-any
const updateCell = (col: number, row: number, fn: (...args: any[]) => any) =>
  evolve({
    board: adjust(
      adjust(
        evolve({
          isInMill: fn
        }),
        row
      ),
      col
    )
  });

const actions = {
  [SET_PAWN]: (payload: SetPawnType) => (state: GameState) =>
    assocPath<string, GameState>(['board', payload.column, payload.row, 'pawn'], state.currentPlayer)(state),
  [NEXT_PLAYER]: (payload: SetPawnType) => (state: GameState) => ({
    ...state,
    currentPlayer: state.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1
  }),
  [REMOVE_PAWN_FROM_HAND]: (payload: PlayerPawnType) =>
    evolve<GameState>({
      [payload.player]: { pawnsInHand: dec, pawnsOnBoard: inc },
    }),
  [REMOVE_PAWN_FROM_BOARD]: (payload: PlayerPawnType) =>
      assocPath<string, GameState>(['board', payload.column, payload.row, 'pawn'], ''),
  [DECREASE_PAWNS_FROM_BOARD]: (payload: PlayerPawnType) =>
    evolve<GameState>({ [payload.player]: { pawnsOnBoard: dec } }),
  [SET_NEXT_MOVE_TEXT]: (payload: NextMoveType) =>
    assoc('nextMove', payload.text),
  [SET_MILL_IN_BOX]: (payload: SetPawnType) =>
    updateCell(payload.column, payload.row, inc),
  [REMOVE_MILL_IN_BOX]: (payload: SetPawnType) =>
    updateCell(payload.column, payload.row, dec),
  [CHANGE_ACTION_TYPE]: (payload: ActionType) =>
    assoc('currentAction', payload.type),
  [HIGHLIGHT_AVAILABLE_PAWN]: (payload: PlayerType) => (state: GameState) => ({
    ...state,
    board: state.board.map(row =>
      row.map((box: BoardCell) =>
        box.isPawnBox && !box.isInMill && box.pawn === payload.player ?
          { ...box, isHighlighted: true } :
          box,
      ),
    ),
  }),
  [CLEAN_HIGHLIGHTED_PAWNS]: (payload: PlayerType) => (state: GameState) => ({
    ...state,
    board: state.board.map(row =>
      row.map((box: BoardCell) =>
        ({ ...box, isHighlighted: false })
      ),
    ),
  }),
  [HIGHLIGHT_AVAILABLE_BOX]: (payload: SetPawnType) =>
    assocPath<boolean, GameState>(['board', payload.column, payload.row, 'isHighlighted'], true),
  [CACHE_PAWN_POSITION]: (payload: SetPawnType) =>
    pipe(
      assocPath<number, GameState>(['cacheSelectedPawn', 'column'], payload.column),
      assocPath<number, GameState>(['cacheSelectedPawn', 'row'], payload.row)
    ),
  [HIGHLIGHT_ALL_AVAILABLE_BOXES]: () => (state: GameState) => ({
    ...state,
    board: state.board.map(row =>
      row.map((box: BoardCell) => box.isPawnBox && !box.pawn ? { ...box, isHighlighted: true } : box),
    ),
  }),
  [SET_WINNER]: (payload: PlayerType) =>
    assoc('winner', payload.player),
  [RESET_GAME]: () => (state: GameState) => ({ ...initialStateGame, boxSize: state.boxSize }),
  [SET_BOX_SIZE]: (payload: { boxSize: number }) =>
    assoc('boxSize', payload.boxSize)
};

export function gameReducer(state: GameState = initialStateGame, action: { payload: {}, type: string }): GameState {
  const stateChangingFn: (payload: {}) => (state: GameState) => GameState = actions[action.type];
  return !!stateChangingFn ? stateChangingFn(action.payload)(state) : state;
}

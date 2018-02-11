// type PlayerType = 'PLAYER1'|'PLAYER2';

export interface SetPawnType {
  row: number;
  column: number;
}

export interface PlayerType {
  player: string;
}

export interface PlayerPawnType {
  row: number;
  column: number;
  player: string;
}

export interface ActionType {
  type: string;
}

export interface NextMoveType {
  text: string;
}

export interface Action {
  type: string;
  payload?: {};
}

export const SET_PAWN = 'SET_PAWN';
export const NEXT_MOVE = 'NEXT_MOVE';
export const NEXT_PLAYER = 'NEXT_PLAYER';
export const REMOVE_PAWN_FROM_HAND = 'REMOVE_PAWN_FROM_HAND';
export const REMOVE_PAWN_FROM_BOARD = 'REMOVE_PAWN_FROM_BOARD';
export const DECREASE_PAWNS_FROM_BOARD = 'DECREASE_PAWNS_FROM_BOARD';
export const SET_NEXT_MOVE_TEXT = 'SET_NEXT_MOVE_TEXT';
export const SET_MILL_IN_BOX = 'SET_MILL_IN_BOX';
export const REMOVE_MILL_IN_BOX = 'REMOVE_MILL_IN_BOX';
export const CHANGE_ACTION_TYPE = 'CHANGE_ACTION_TYPE';
export const HIGHLIGHT_AVAILABLE_PAWN = 'HIGHLIGHT_AVAILABLE_PAWN';
export const HIGHLIGHT_AVAILABLE_BOX = 'HIGHLIGHT_AVAILABLE_BOX';
export const HIGHLIGHT_ALL_AVAILABLE_BOXES = 'HIGHLIGHT_ALL_AVAILABLE_BOXES';
export const CACHE_PAWN_POSITION = 'CACHE_PAWN_POSITION';
export const CLEAN_HIGHLIGHTED_PAWNS = 'CLEAN_HIGHLIGHTED_PAWNS';
export const SET_WINNER = 'SET_WINNER';
export const RESET_GAME = 'RESET_GAME';
export const CALL_BOX_SIZE = 'CALL_BOX_SIZE';
export const SET_BOX_SIZE = 'SET_BOX_SIZE';

function newAction(type: string) {
  return (payload?: {}): Action => ({ payload, type });
}

export const nextPlayer: () => Action = newAction(NEXT_PLAYER);
export const setPawn: (payload: SetPawnType) => Action = newAction(SET_PAWN);
export const nextMove: (payload: SetPawnType) => Action = newAction(NEXT_MOVE);
export const removePawnFromHand: (payload: PlayerType) => Action = newAction(REMOVE_PAWN_FROM_HAND);
export const removePawnFromBoard: (payload: PlayerPawnType) => Action = newAction(REMOVE_PAWN_FROM_BOARD);
export const setNextMoveText: (payload: NextMoveType) => Action = newAction(SET_NEXT_MOVE_TEXT);
export const setMillInBox: (payload: SetPawnType) => Action = newAction(SET_MILL_IN_BOX);
export const removeMillInBox: (payload: SetPawnType) => Action = newAction(REMOVE_MILL_IN_BOX);
export const changeActionType: (payload: ActionType) => Action = newAction(CHANGE_ACTION_TYPE);
export const highlightAvailablePawns: (payload: PlayerType) => Action = newAction(HIGHLIGHT_AVAILABLE_PAWN);
export const highlightAvailableBox: (payload: SetPawnType) => Action = newAction(HIGHLIGHT_AVAILABLE_BOX);
export const highlightAllAvailableBoxes: () => Action = newAction(HIGHLIGHT_ALL_AVAILABLE_BOXES);
export const cachePawnPosition: (payload: SetPawnType) => Action = newAction(CACHE_PAWN_POSITION);
export const cleanHighlightedPawns: () => Action = newAction(CLEAN_HIGHLIGHTED_PAWNS);
export const setWinner: (payload: PlayerType) => Action = newAction(SET_WINNER);
export const resetGame: () => Action = newAction(RESET_GAME);
export const decreasePawnsFromBoard: (payload: PlayerType) => Action = newAction(DECREASE_PAWNS_FROM_BOARD);
export const callBoxSize: (payload: { boxSize: number }) => Action = newAction(CALL_BOX_SIZE);
export const setBoxSize: (payload: { boxSize: number }) => Action = newAction(SET_BOX_SIZE);

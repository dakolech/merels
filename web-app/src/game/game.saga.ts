import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE } from '../../../shared/game/game.actions';
import { gameLogic } from '../../../shared/game/game.logic';
import { map } from 'ramda';
import { GameState, SimpleCell } from '../../../shared/game/game.helpers';


// tslint:disable-next-line:no-any
function* nextMove(action: any) {
  const { row, column } = action.payload as SimpleCell;
  const state: GameState = yield select();

  yield map(put, gameLogic(row, column, state));

}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}

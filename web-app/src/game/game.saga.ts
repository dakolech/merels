import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE } from 'merels-shared';
import { gameLogic } from 'merels-shared';
import { map } from 'ramda';
import { GameState, SimpleCell } from 'merels-shared';


// tslint:disable-next-line:no-any
function* nextMove(action: any) {
  const { row, column } = action.payload as SimpleCell;
  const state: GameState = yield select();

  yield map(put, gameLogic(row, column, state));

}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}

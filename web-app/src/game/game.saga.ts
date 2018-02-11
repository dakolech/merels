import { put, takeEvery, select } from 'redux-saga/effects';
import { NEXT_MOVE } from '../shared';
import { gameLogic } from '../shared';
import { map } from 'ramda';
import { SimpleCell } from '../shared';
import { AppState } from '../configureStore';

// tslint:disable-next-line:no-any
function* nextMove(action: any) {
  const { row, column } = action.payload as SimpleCell;
  const state: AppState = yield select();

  yield map(put, gameLogic(row, column, state));

}

export function* gameSaga() {
  yield takeEvery(NEXT_MOVE, nextMove);
}

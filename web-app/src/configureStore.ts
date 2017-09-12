import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { gameReducer as game, gameSaga } from './game';
import { GameState } from 'merels-shared';

export const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const middleware = [routerMiddleware(history), sagaMiddleware];
const devTools = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

const composeEnhancers = window[devTools] || compose;

export interface AppState {
  game: GameState;
}

export const store = createStore(
  combineReducers({
    game,
    router: routerReducer
  }),
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

function* rootSaga() {
  yield [
    fork(gameSaga),
  ];
}

sagaMiddleware.run(rootSaga);

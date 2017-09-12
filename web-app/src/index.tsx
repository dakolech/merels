import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './configureStore';
import { boardToDraw } from './game/board.generator';
import { setBoxSize } from './game/game.actions';
import { throttle } from 'lodash';

function calculateBoxSize(boardLength: number, padding: number = 2) {
  return {
    boxSize: Math.min(
      Math.floor(((window.innerWidth - (padding * 2)) / boardLength)),
      Math.floor(((window.innerHeight - (padding * 2)) / boardLength))
    )
  };
}

window.addEventListener(
  'resize',
  throttle(
    () => {
      store.dispatch(setBoxSize(calculateBoxSize(boardToDraw.length)));
    },
    1000
  )
);

store.dispatch(setBoxSize(calculateBoxSize(boardToDraw.length)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

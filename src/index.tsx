import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './configureStore';
import { boardToDraw } from './game/board.generator';
import { padding } from './game/game.reducer';
import { callBoxSize } from './game/game.actions';

window.addEventListener('resize', () => {
  store.dispatch(callBoxSize({ boxSize: Math.min(
    Math.floor(((window.innerWidth - (padding * 2)) / boardToDraw.length)),
    Math.floor(((window.innerHeight - (padding * 2)) / boardToDraw.length))
  )}))
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

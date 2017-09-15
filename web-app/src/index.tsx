import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppComponent } from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './configureStore';
import { boardToDraw } from 'merels-shared';
import { setBoxSize } from 'merels-shared';
import { throttle } from 'lodash';

function calculateBoxSize(boardLength: number, padding: number = 2) {
  return {
    boxSize: Math.min(
      Math.floor(((window.innerWidth - (padding * 2) - 40) / boardLength)),
      Math.floor(((window.innerHeight - (padding * 2) - 40) / boardLength))
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
    <AppComponent />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

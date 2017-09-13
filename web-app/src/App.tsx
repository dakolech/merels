import * as React from 'react';
import './App.css';
import './generated-font/css/merels.css';
import '../node_modules/font-awesome/css/font-awesome.css';
import { BoardContainerComponent } from './game/components/boardContainer/boardContainer.component';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <BoardContainerComponent />
        <footer> {process.env.REACT_APP_BRANCH} </footer>
      </div>
    );
  }
}

export default App;

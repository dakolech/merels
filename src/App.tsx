import * as React from 'react';
import './App.css';
import './generated-font/css/merels.css';
import '../node_modules/font-awesome/css/font-awesome.css';
import { BoardContainerComponent } from './game/components/boardContainer/boardContainer.component';

// const logo = require('./logo.svg');

class App extends React.Component<{}, {}> {
  render() {
    return (
      <BoardContainerComponent></BoardContainerComponent>
    );
  }
}

export default App;

import * as React from 'react';
import './App.css';
import './generated-font/css/merels.css';
import '../node_modules/font-awesome/css/font-awesome.css';
import { BoardContainerComponent } from './game/components/boardContainer/boardContainer.component';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AppState } from './configureStore';
import { path } from 'ramda';

const Main = styled.div``;

function App() {
  const Container = styled.div``;

  return (
    <Container>
      <Main>
        <BoardContainerComponent />
      </Main>
      <footer> {process.env.REACT_APP_BRANCH} </footer>
    </Container>
  );
}

const mapStateToProps = (state: AppState) => ({
  board: path(['game', 'boardToDraw'], state),
  boxSize: path(['game', 'boxSize'], state),
});

export const AppComponent = connect(mapStateToProps)(App);

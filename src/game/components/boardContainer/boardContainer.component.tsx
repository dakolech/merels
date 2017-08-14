import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import { bindActionCreators } from 'redux';

import { BoardComponent } from '../board';
import { GameComponent } from '../game';
import { NextMoveComponent } from '../nextMove';
import { PlayersComponent } from '../players';
import { Action, resetGame } from '../../game.actions';
import { Board } from '../../board.generator';
import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';

interface Props {
  board: Board;
  boxSize: number;
  resetGame: () => Action;
}



function BoardContainer(props: Props) {
  const Container = styled.div`
     height: ${(props.boxSize * props.board.length) + (2 * 20)}px;
     position: relative;
  `;

  return (
    <div>
      <div>
        <Container>
          <BoardComponent />
          <GameComponent />
        </Container>
        <div>
          <NextMoveComponent />
        </div>
        <div>
          <PlayersComponent />
        </div>
        <div>
          <span onClick={() => props.resetGame()}> Reset Game </span>
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch: Dispatch<AppState>) {
  return bindActionCreators({ resetGame }, dispatch);
}

const mapStateToProps = (state: AppState) => ({
  board: path(['game', 'boardToDraw'], state),
  boxSize: path(['game', 'boxSize'], state),
});

export const BoardContainerComponent = connect(mapStateToProps, mapDispatchToProps)(BoardContainer);

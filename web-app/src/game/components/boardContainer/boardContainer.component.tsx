import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BoardComponent } from '../board';
import { GameComponent } from '../game';
import { NextMoveComponent } from '../nextMove';
import { PlayersComponent } from '../players';
import { Action, resetGame } from 'merels-shared';
import { Board } from 'merels-shared';
import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';

interface Props {
  board: Board;
  boxSize: number;
  resetGame: () => Action;
}

const Container = styled.div`
  grid-column-start: 3;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 2;
`;

const TopContainer = styled.div`
  grid-column-start: 3;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 1;
`;

const NextMoveContainer = TopContainer.extend`
  justify-self: center;
  margin-top: 10px;
`;

const PlayersContainer = Container.extend`
  justify-content: center;
  align-items: center;
  display: flex;
`;

const ResetContainer = TopContainer.extend`
  justify-self: flex-end;
  margin-right: 26px;
  margin-top: 5px;
  cursor: pointer;
  padding: 10px;
  border: 1px solid black;
  line-height: 10px;
  height: 10px;
`;

function BoardContainer(props: Props) {
  const Main = styled.div`
    display: grid;
    grid-template-columns: auto 20px ${(props.boxSize * props.board.length)}px 20px auto;
    grid-template-rows: 20px ${(props.boxSize * props.board.length)}px 20px;
  `;
//   const Container = styled.div`
//      height: ${(props.boxSize * props.board.length)}px;
//      width: ${(props.boxSize * props.board.length)}px;
//      position: relative;
//   `;

  return (
    <Main>
      <Container>
        <BoardComponent />
        <GameComponent />
      </Container>
      <NextMoveContainer>
        <NextMoveComponent />
      </NextMoveContainer>
      <PlayersContainer>
        <PlayersComponent />
      </PlayersContainer>
      <ResetContainer>
        <span onClick={() => props.resetGame()}> Reset Game </span>
      </ResetContainer>
    </Main>
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

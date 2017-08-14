import * as React from 'react';
import { connect } from 'react-redux';
import { BoardToDraw } from '../../board.generator';
import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';
import {PawnContainerComponent} from './pawnContainer.component';

interface Props {
  boxSize: number;
  boardToDraw: BoardToDraw;
}


const Cell = styled.div`
  display: block;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

function Game(props: Props) {
  const Row = styled.div`
    display: inline-grid;
    width: ${props.boxSize}px;
  `;
  console.log('Game')

  return (
    <Container className="Game">
      {props.boardToDraw.map((column, columnIndex) => (
        <Row key={columnIndex}>
          {column.map((_, boxIndex) => {
            return (
              <Cell
                key={boxIndex}
                style={{ width: props.boxSize, height: props.boxSize }}
              >
              <PawnContainerComponent column={columnIndex} row={boxIndex}  />
              </Cell>
            )
          })}
        </Row>
      ))}
    </Container>
  );
}

const mapStateToProps = (state: AppState) => ({
  boardToDraw: path(['game', 'boardToDraw'], state),
  boxSize: path(['game', 'boxSize'], state),
});

export const GameComponent = connect(mapStateToProps)(Game);

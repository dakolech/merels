import * as React from 'react';
import { connect } from 'react-redux';
import { PLAYER1, PLAYER2 } from '../../game.reducer';
import { BoardCell } from '../../board.generator';
import { AppState } from '../../../configureStore';
import { path } from 'ramda';
import styled from 'styled-components';

interface OwnProps {
  box: BoardCell;
  boxSize: number;
}

interface StateProps {
  PLAYER1: string;
  PLAYER2: string;
}

function Pawn(props: OwnProps&StateProps) {
  const PawnIcon = styled.i`
    font-size: ${props.boxSize}px;
    color: ${props[props.box.pawn]};
  `;
  console.log('Pawn')
  return props.box.pawn ? <PawnIcon className="fa fa-circle"></PawnIcon> : null;
}

const mapStateToProps = (state: AppState): StateProps => ({
  PLAYER1: path(['game', PLAYER1, 'color'], state),
  PLAYER2: path(['game', PLAYER2, 'color'], state),
});

export const PawnComponent = connect<StateProps, any, any>(mapStateToProps)(Pawn);
